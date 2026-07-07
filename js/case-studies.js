
const openBtn = document.getElementById("mobileMenuBtn");
const closeBtn = document.getElementById("closeMobileBtn");
const overlay = document.getElementById("mobileNavOverlay");

if (openBtn && overlay && closeBtn) {
  openBtn.addEventListener("click", () => overlay.classList.add("open"));
  closeBtn.addEventListener("click", () => overlay.classList.remove("open"));
}

if (history.scrollRestoration) {
  history.scrollRestoration = "manual";
}
window.addEventListener("beforeunload", () => {
  window.scrollTo(0, 0);
});
window.scrollTo(0, 0);


const caseStudiesData = [
  {
    num: "01",
    category: "Surveillance",
    title: "State Network Infrastructure",
    desc: "AI-powered threat detection and continuous security perimeter telemetry optimized across multi-node state municipal systems.",
    img: "https://www.shutterstock.com/shutterstock/photos/2218163187/display_1500/stock-photo--g-and-lte-base-station-with-bunch-of-antennae-for-new-radio-nr-service-install-on-the-top-of-2218163187.jpg",
  },
  {
    num: "02",
    category: "Cloud Systems",
    title: "Cloud & Data Platform Modernisation",
    desc: "Deploying high-efficiency zero-trust infrastructure layers for over 200+ active cross-regional corporate branch offices seamlessly.",
    img: "https://www.shutterstock.com/shutterstock/photos/2681995085/display_1500/stock-photo-hand-using-laptop-with-virtual-education-icons-symbolizing-online-learning-digital-skills-2681995085.jpg",
  },
  {
    num: "03",
    category: "Analytics",
    title: "City Surveillance & Monitoring Integration",
    desc: "Integrating predictive resource matrices and algorithmic customer pattern insights for wide-area commercial grid sectors.",
    img: "https://www.shutterstock.com/shutterstock/photos/2667823583/display_1500/stock-photo-hua-hin-thailand-september-close-up-of-a-surveillance-enforcement-camera-monitor-city-2667823583.jpg",
  },
  {
    num: "04",
    category: "IT Networks",
    title: "Multi-Department Digital Rollout",
    desc: "Transforming internal communications and establishing modern data delivery loops for complex, layered industrial networks.",
    img: "https://www.shutterstock.com/shutterstock/photos/2187281913/display_1500/stock-photo-group-of-department-company-staff-members-millennial-multi-racial-employees-working-in-modern-co-2187281913.jpg",
  },
  {
    num: "05",
    category: "AI Automation",
    title: "Intelligent Enforcement Management Systems (IEMS)",
    desc: "Machine learning integration targeting early mechanical fault diagnosis, successfully dropping enterprise system downtime by 35%.",
    img: "https://www.shutterstock.com/shutterstock/photos/1836201124/display_1500/stock-photo-radar-speed-control-camera-on-the-highway-speed-camera-monitoring-busy-traffic-road-the-cameras-1836201124.jpg",
  },
];

function renderBlogGridCaseStudies() {
  const blogGridTrack = document.getElementById("blogGridTrack");
  if (!blogGridTrack) return;

  blogGridTrack.innerHTML = "";
  caseStudiesData.forEach((data) => {
    const card = document.createElement("div");
    card.className = "cs-card";

    card.innerHTML = `
            <div class="cs-num">${data.num}</div>
            <span class="cs-category-badge">${data.category}</span>
            <div class="cs-card-img-wrap">
                <img src="${data.img}" alt="${data.title}" loading="lazy">
            </div>
            <div class="cs-card-body">
                <h3>${data.title}</h3>
                <p>${data.desc}</p>
                <a href="#" class="card-footer-link">Read Full Breakdown <i class="fas fa-arrow-right"></i></a>
            </div>
        `;
    blogGridTrack.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderBlogGridCaseStudies();
});
