const fs = require('fs');
const path = require('path');
const Parser = require('rss-parser');
const parser = new Parser();

const DATA_FILE = path.join(__dirname, 'data', 'news.json');

const FEEDS = [
  { name: 'Telecom', url: 'https://telecom.economictimes.indiatimes.com/rss/topstories' },
  { name: 'Telecom', url: 'https://www.rcrwireless.com/feed' },
  { name: 'Cybersecurity', url: 'https://feeds.feedburner.com/TheHackersNews' },
  { name: 'Cybersecurity', url: 'https://www.bleepingcomputer.com/feed/' },
  { name: 'AI', url: 'https://www.technologyreview.com/topic/artificial-intelligence/feed/' },
  { name: 'AI', url: 'https://openai.com/news/rss.xml' }
];

async function updateNewsFeed() {
  const cutoff = Date.now() - (24 * 60 * 60 * 1000); // 24-hour expiration threshold
  let existingNews = [];

  if (fs.existsSync(DATA_FILE)) {
    try {
      const raw = fs.readFileSync(DATA_FILE, 'utf8');
      existingNews = JSON.parse(raw);
    } catch (e) {
      existingNews = [];
    }
  }

  // Step 1: Purge any existing blogs older than 24 hours
  let activeNews = existingNews.filter(item => {
    const time = new Date(item.pubDate || item.date || item.isoDate).getTime();
    return !isNaN(time) && time >= cutoff;
  });

  // Step 2: Fetch and merge latest items
  for (const feed of FEEDS) {
    try {
      const feedData = await parser.parseURL(feed.url);
      feedData.items.forEach(item => {
        const itemDate = new Date(item.pubDate || item.date || item.isoDate).getTime();
        
        // Only consider items published within the last 24 hours
        if (!isNaN(itemDate) && itemDate >= cutoff) {
          const isDuplicate = activeNews.some(n => n.link === item.link || n.title === item.title);
          if (!isDuplicate) {
            activeNews.push({
              title: item.title,
              link: item.link,
              pubDate: item.pubDate || item.isoDate,
              contentSnippet: item.contentSnippet || item.summary || '',
              source: feed.name
            });
          }
        }
      });
    } catch (err) {
      console.error(`Error fetching feed ${feed.name}:`, err.message);
    }
  }

  // Step 3: Sort by publication date descending and limit size
  activeNews.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
  const bestBlogs = activeNews.slice(0, 30);

  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(bestBlogs, null, 2), 'utf8');
  console.log(`[${new Date().toISOString()}] Blog sync complete. ${bestBlogs.length} active 24h stories stored.`);
}

updateNewsFeed();