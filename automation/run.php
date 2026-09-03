<?php
header("Content-Type: text/plain; charset=utf-8");
error_reporting(E_ALL);
ini_set('display_errors', 1);

set_time_limit(300);
chdir(__DIR__);

const DATA_FILE = __DIR__ . '/../news.json';

$feeds = [
    ['name' => 'AI', 'url' => 'https://openai.com/news/rss.xml'],
    ['name' => 'Cloud', 'url' => 'https://aws.amazon.com/blogs/aws/feed/'],
    ['name' => 'Cybersecurity', 'url' => 'https://krebsonsecurity.com/feed/'],
    ['name' => 'Cybersecurity', 'url' => 'https://www.microsoft.com/en-us/security/blog/feed/'],
    ['name' => 'Cybersecurity', 'url' => 'https://security.googleblog.com/feeds/posts/default'],
    ['name' => 'Networking', 'url' => 'https://blog.cloudflare.com/rss/'],
    ['name' => 'Development', 'url' => 'https://github.blog/feed/']
];

function isEnglishArticle(string $title, string $description): bool {
    $text = $title . ' ' . $description;
    $scriptPatterns = [
        '/[\x{4e00}-\x{9fff}]/u', // Chinese
        '/[\x{3040}-\x{30ff}]/u', // Japanese Hiragana / Katakana
        '/[\x{ac00}-\x{d7af}]/u', // Korean
        '/[\x{0600}-\x{06ff}]/u', // Arabic
        '/[\x{0400}-\x{04ff}]/u', // Cyrillic / Russian
    ];

    foreach ($scriptPatterns as $pattern) {
        if (preg_match($pattern, $text)) {
            return false;
        }
    }
    return true;
}

function fetchFeed(string $url): ?string {
    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL            => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_TIMEOUT        => 30,
        CURLOPT_CONNECTTIMEOUT => 15,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_SSL_VERIFYHOST => 0,
        CURLOPT_USERAGENT      => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
    ]);

    $body = curl_exec($ch);
    $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($body !== false && $status >= 200 && $status < 300) {
        return $body;
    }

    if (ini_get('allow_url_fopen')) {
        $context = stream_context_create([
            'http' => ['timeout' => 30, 'user_agent' => 'Mozilla/5.0'],
            'ssl' => ['verify_peer' => false, 'verify_peer_name' => false]
        ]);
        $stream = @file_get_contents($url, false, $context);
        if ($stream !== false) return $stream;
    }

    return null;
}

function syncNews(array $feeds): void {
    $cutoff = time() - (24 * 60 * 60);
    $storedArticles = [];

    if (file_exists(DATA_FILE)) {
        $raw = file_get_contents(DATA_FILE);
        if ($raw !== false) {
            $parsed = json_decode($raw, true);
            if (is_array($parsed)) {
                $storedArticles = $parsed;
            }
        }
    }

    // Purge items older than 24 hours
    $activeArticles = array_values(array_filter($storedArticles, function ($item) use ($cutoff) {
        $dateStr = $item['pubDate'] ?? $item['date'] ?? $item['isoDate'] ?? null;
        if (!$dateStr) return false;
        $timestamp = strtotime($dateStr);
        return ($timestamp !== false && $timestamp >= $cutoff);
    }));

    foreach ($feeds as $feed) {
        echo "Fetching [{$feed['name']}]: {$feed['url']}\n";
        $xmlString = fetchFeed($feed['url']);
        if (!$xmlString) {
            echo "Skipped: Network request failed for {$feed['name']}\n";
            continue;
        }

        libxml_use_internal_errors(true);
        $xml = simplexml_load_string($xmlString, 'SimpleXMLElement', LIBXML_NOCDATA);

        if ($xml === false) {
            echo "Skipped: Invalid XML from {$feed['name']}\n";
            libxml_clear_errors();
            continue;
        }

        $entries = [];
        if (isset($xml->channel->item)) {
            $entries = $xml->channel->item;
        } elseif (isset($xml->entry)) {
            $entries = $xml->entry;
        }

        foreach ($entries as $item) {
            $title = trim((string)($item->title ?? 'Untitled'));
            $link = '';
            if (isset($item->link)) {
                $link = isset($item->link['href']) ? (string)$item->link['href'] : (string)$item->link;
            }
            $link = trim($link);

            $snippet = '';
            if (isset($item->description)) {
                $snippet = (string)$item->description;
            } elseif (isset($item->summary)) {
                $snippet = (string)$item->summary;
            } elseif (isset($item->content)) {
                $snippet = (string)$item->content;
            }
            $snippet = trim(strip_tags($snippet));

            if (!isEnglishArticle($title, $snippet)) {
                continue;
            }

            $pubDateRaw = (string)($item->pubDate ?? $item->updated ?? $item->published ?? '');
            $articleTime = strtotime($pubDateRaw);

            if ($articleTime === false || $articleTime < $cutoff) {
                continue;
            }

            $duplicate = false;
            foreach ($activeArticles as $existing) {
                if (
                    (!empty($link) && ($existing['link'] ?? '') === $link) ||
                    (!empty($title) && ($existing['title'] ?? '') === $title)
                ) {
                    $duplicate = true;
                    break;
                }
            }

            if (!$duplicate) {
                $activeArticles[] = [
                    'title'          => $title !== '' ? $title : 'Untitled',
                    'link'           => $link,
                    'pubDate'        => date('Y-m-d\TH:i:s\Z', $articleTime),
                    'contentSnippet' => $snippet,
                    'source'         => $feed['name']
                ];
            }
        }
    }

    usort($activeArticles, function ($a, $b) {
        $tA = strtotime($a['pubDate'] ?? 0);
        $tB = strtotime($b['pubDate'] ?? 0);
        return $tB <=> $tA;
    });

    $finalArticles = array_slice($activeArticles, 0, 100);

    $directory = dirname(DATA_FILE);
    if (!is_dir($directory)) {
        mkdir($directory, 0755, true);
    }

    file_put_contents(
        DATA_FILE,
        json_encode($finalArticles, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE)
    );

    $now = date('Y-m-d\TH:i:s\Z');
    $count = count($finalArticles);
    echo "[$now] Completed sync. $count stories active in the last 24 hours.\n";
}

syncNews($feeds);