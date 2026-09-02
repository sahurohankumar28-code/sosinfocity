const fs = require('fs');
const path = require('path');
const Parser = require('rss-parser');

const parser = new Parser();

const DATA_FILE = path.join(__dirname, '..', 'news.json');

const FEEDS = [
  { name: 'Telecom', url: 'https://telecoms.com/feed/' },
  { name: 'Telecom', url: 'https://www.lightreading.com/rss.xml' },

  { name: 'Cybersecurity', url: 'https://feeds.feedburner.com/TheHackersNews' },
  { name: 'Cybersecurity', url: 'https://krebsonsecurity.com/feed/' },

  { name: 'AI', url: 'https://www.technologyreview.com/topic/artificial-intelligence/feed/' },
  { name: 'AI', url: 'https://openai.com/news/rss.xml' },
  { name: 'AI', url: 'https://blog.research.google/atom.xml' },

  { name: 'Software', url: 'https://feed.infoq.com' },

  { name: 'Networking', url: 'https://www.networkworld.com/feed/' },
  { name: 'Networking', url: 'https://packetpushers.net/feed/' }
];


/*
 * Check whether an article contains non-English scripts.
 *
 * This blocks:
 * Chinese
 * Japanese
 * Korean
 * Arabic
 * Cyrillic/Russian
 */
function isEnglishArticle(item) {
  const title = item.title || '';
  const description =
    item.contentSnippet ||
    item.summary ||
    item.content ||
    '';

  const text = `${title} ${description}`;

  // Chinese
  if (/[\u4e00-\u9fff]/.test(text)) {
    return false;
  }

  // Japanese Hiragana / Katakana
  if (/[\u3040-\u30ff]/.test(text)) {
    return false;
  }

  // Korean
  if (/[\uac00-\ud7af]/.test(text)) {
    return false;
  }

  // Arabic
  if (/[\u0600-\u06ff]/.test(text)) {
    return false;
  }

  // Cyrillic / Russian and related languages
  if (/[\u0400-\u04ff]/.test(text)) {
    return false;
  }

  return true;
}


async function updateNewsFeed() {
  const cutoff = Date.now() - (24 * 60 * 60 * 1000);

  let existingNews = [];

  // Load existing news.json
  if (fs.existsSync(DATA_FILE)) {
    try {
      const raw = fs.readFileSync(DATA_FILE, 'utf8');
      existingNews = JSON.parse(raw);

      if (!Array.isArray(existingNews)) {
        existingNews = [];
      }
    } catch (e) {
      console.error('Error reading news.json:', e.message);
      existingNews = [];
    }
  }


  // Step 1:
  // Remove existing blogs older than 24 hours
  let activeNews = existingNews.filter(item => {
    const time = new Date(
      item.pubDate ||
      item.date ||
      item.isoDate
    ).getTime();

    return !isNaN(time) && time >= cutoff;
  });


  // Step 2:
  // Fetch and merge latest RSS items
  for (const feed of FEEDS) {
    try {
      console.log(`Fetching: ${feed.name} - ${feed.url}`);

      const feedData = await parser.parseURL(feed.url);

      feedData.items.forEach(item => {

        // -----------------------------------------
        // English language/script filter
        // -----------------------------------------
        if (!isEnglishArticle(item)) {
          console.log(
            `Skipped non-English article: ${item.title || 'Untitled'}`
          );
          return;
        }


        // -----------------------------------------
        // Publication date
        // -----------------------------------------
        const itemDate = new Date(
          item.pubDate ||
          item.date ||
          item.isoDate
        ).getTime();


        // Only consider articles from last 24 hours
        if (!isNaN(itemDate) && itemDate >= cutoff) {

          // -----------------------------------------
          // Duplicate check
          // -----------------------------------------
          const isDuplicate = activeNews.some(n =>
            n.link === item.link ||
            n.title === item.title
          );


          if (!isDuplicate) {
            activeNews.push({
              title: item.title || 'Untitled',
              link: item.link || '',
              pubDate: item.pubDate || item.isoDate,
              contentSnippet:
                item.contentSnippet ||
                item.summary ||
                '',
              source: feed.name
            });
          }
        }
      });

    } catch (err) {
      console.error(
        `Error fetching feed ${feed.name}:`,
        err.message
      );
    }
  }


  // Step 3:
  // Sort newest articles first
  activeNews.sort((a, b) =>
    new Date(b.pubDate).getTime() -
    new Date(a.pubDate).getTime()
  );


  // Step 4:
  // Keep maximum 100 articles
  const bestBlogs = activeNews.slice(0, 100);


  // Step 5:
  // Make sure data directory exists
  fs.mkdirSync(
    path.dirname(DATA_FILE),
    { recursive: true }
  );


  // Step 6:
  // Save news.json
  fs.writeFileSync(
    DATA_FILE,
    JSON.stringify(bestBlogs, null, 2),
    'utf8'
  );


  console.log(
    `[${new Date().toISOString()}] Blog sync complete. ` +
    `${bestBlogs.length} active English-script stories stored.`
  );
}


updateNewsFeed();