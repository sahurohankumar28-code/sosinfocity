document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("jobs-container");
  if (!container) return;

  const API_URL = "jobs.json";

  try {
    const response = await fetch(API_URL);
    const jobs = await response.json();

    if (!jobs || jobs.length === 0) {
      container.innerHTML = `
        <div class="loading-state-card">
          <i class="fas fa-folder-open"></i>
          <p>No active openings right now. Check back soon!</p>
        </div>
      `;
      return;
    }

    container.innerHTML = jobs.map(job => {
      const encodedJobUrl = `apply.html?job=${encodeURIComponent(job.title)}`;
      
      const postedDateHtml = job.postedDate 
        ? `<div class="job-date-badge"><i class="fas fa-calendar-day"></i> Posted: ${job.postedDate}</div>` 
        : '';

      return `
        <div class="job-grid-card" data-title="${job.title}">
          <div class="card-top-meta">
            <span class="type-pill full-time">${job.type || 'Full-Time'}</span>
          </div>
          <h4>${job.title}</h4>
          ${postedDateHtml}
          <p class="card-text">
            <i class="fas fa-briefcase"></i> <span>${job.experience || 'Experienced'}</span>
          </p>
          <p class="card-text">
            <i class="fas fa-map-marker-alt"></i> <span>${job.location || 'Bhubaneswar, Odisha'}</span>
          </p>
          <a href="${encodedJobUrl}" class="btn-browse-job">
            Apply Now <i class="fas fa-arrow-right"></i>
          </a>
        </div>
      `;
    }).join("");

  } catch (error) {
    console.error("Error loading jobs from JSON:", error);
    container.innerHTML = `
      <div class="loading-state-card">
        <i class="fas fa-triangle-exclamation" style="color: #ef4444;"></i>
        <p>Unable to load active openings. Please email your profile directly to <a href="mailto:hr@sosinfocity.in">hr@sosinfocity.in</a></p>
      </div>
    `;
  }
});