let allArticles = [];

async function loadBlogs() {
  const blogGrid = document.getElementById('blogGrid');
  const filterContainer = document.getElementById('feedFilters');

  try {
    const res = await fetch('nexus-blog/automation/data/news.json?t=' + Date.now());
    if (!res.ok) throw new Error('Data not available');
    const rawData = await res.json();

    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;

    allArticles = rawData.filter(item => {
      const pubDate = new Date(item.pubDate || item.date || item.isoDate).getTime();
      return !isNaN(pubDate) && pubDate >= oneDayAgo;
    });

    if (allArticles.length === 0) {
      blogGrid.innerHTML = `
        <div class="feed-status" style="grid-column: 1/-1; text-align: center; padding: 60px 0;">
          <i class="fas fa-newspaper" style="font-size: 2rem; color: #cbd5e1; margin-bottom: 12px; display: block;"></i>
          No stories recorded in the past 24 hours. Check back after the next scheduled sync.
        </div>`;
      return;
    }

    renderFilters(filterContainer);
    renderFeed(allArticles);
  } catch (err) {
    blogGrid.innerHTML = `
      <div class="feed-status" style="grid-column: 1/-1; text-align: center; padding: 60px 0; color: #ef4444;">
        <i class="fas fa-circle-exclamation" style="font-size: 1.8rem; margin-bottom: 10px; display: block;"></i>
        Failed to fetch real-time intelligence. Please try refreshing shortly.
      </div>`;
  }
}

function renderFeed(items) {
  const blogGrid = document.getElementById('blogGrid');
  blogGrid.innerHTML = items.map(item => {
    const pubDate = new Date(item.pubDate || item.date || item.isoDate);
    const timeAgo = formatTimeAgo(pubDate);
    const cleanSnippet = (item.contentSnippet || item.description || '')
      .replace(/<[^>]*>?/gm, '')
      .slice(0, 150) + '...';

    return `
      <article class="blog-card">
        <div>
          <div class="blog-card-meta">
            <span class="source-tag">${item.source || 'Tech Pulse'}</span>
            <span class="time-tag"><i class="far fa-clock"></i> ${timeAgo}</span>
          </div>
          <h3>
            <a href="${item.link}" target="_blank" rel="noopener noreferrer">${item.title}</a>
          </h3>
          <p>${cleanSnippet}</p>
        </div>
        <a href="${item.link}" target="_blank" rel="noopener noreferrer" class="blog-read-more">
          Read Story <i class="fas fa-arrow-right"></i>
        </a>
      </article>
    `;
  }).join('');
}

function renderFilters(container) {
  const sources = ['all', ...new Set(allArticles.map(a => a.source).filter(Boolean))];
  if (sources.length <= 2) return;

  container.innerHTML = sources.map((source, index) => `
    <button class="pill ${index === 0 ? 'active' : ''}" data-filter="${source}">
      ${source === 'all' ? 'All Intelligence' : source}
    </button>
  `).join('');

  container.querySelectorAll('.pill').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const selected = btn.dataset.filter;
      const filtered = selected === 'all' ? allArticles : allArticles.filter(a => a.source === selected);
      renderFeed(filtered);
    });
  });
}

function formatTimeAgo(date) {
  const diffHrs = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60));
  if (diffHrs < 1) return 'Just now';
  return `${diffHrs}h ago`;
}

loadBlogs();