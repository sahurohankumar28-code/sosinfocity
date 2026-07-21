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
    id: 1,
    num: "01",
    title: "Intelligent Enforcement Management Systems (IEMS)",
    subtitle:
      "Machine learning integration targeting early mechanical fault diagnosis, successfully dropping enterprise system downtime by 35%.",
    img: "images/case_study_1.jpg",
    challenge:
      "The enterprise experienced frequent and costly system downtime due to unanticipated mechanical failures. The lack of predictive maintenance capabilities resulted in reactive problem-solving, causing significant operational disruptions. Maintenance costs were escalating, and the organization needed a proactive approach to equipment management.",
    solution:
      "Development and deployment of an ML-powered Intelligent Enforcement Management System that transformed the organization's approach to maintenance. The solution provided real-time monitoring, predictive analytics, and automated alert systems for early fault detection. Machine learning algorithms continuously improved accuracy, enabling proactive intervention before failures occurred.",
    results: [
      "35% reduction in system downtime",
      "85% accuracy in mechanical fault prediction",
      "50% decrease in maintenance costs",
      "Proactive issue resolution before operational impact",
      "Real-time monitoring of critical systems",
      "Extended equipment lifecycle by 40%",
    ],
  },
  {
    id: 2,
    num: "02",
    title: "City Surveillance & Monitoring Integration",
    subtitle:
      "Integrating predictive resource matrices and algorithmic customer pattern insights for wide-area commercial grid sectors.",
    img: "images/case_study_2.jpg",
    challenge:
      "The city required a unified monitoring system capable of processing vast amounts of data from multiple sources simultaneously. Existing systems operated in isolation, preventing comprehensive urban management insights. The city needed predictive capabilities to optimize resource allocation and respond proactively to emerging situations across commercial and municipal sectors.",
    solution:
      "Deployment of an AI-powered analytics platform that unified all city monitoring systems into a single intelligent framework. The solution incorporated predictive resource allocation algorithms, pattern recognition for anomaly detection, and integrated monitoring across commercial and municipal sectors. Real-time data processing enabled instant insights and proactive decision-making.",
    results: [
      "Real-time monitoring across entire city grid",
      "92% accuracy in predictive analytics",
      "Optimized resource allocation across all municipal sectors",
      "Enhanced public safety with 60% faster emergency response",
      "Reduced energy consumption by 25% through smart optimization",
      "Comprehensive dashboard providing unified city insights",
    ],
  },
  {
    id: 3,
    num: "03",
    title: "State Network Infrastructure",
    subtitle:
      "AI-powered threat detection and continuous security perimeter telemetry optimized across multi-node state municipal systems.",
    img: "images/case_study_3.jpg",
    challenge:
      "The state's existing network infrastructure faced significant challenges with outdated security protocols that couldn't keep pace with evolving cyber threats. Fragmented monitoring systems created blind spots, and the inability to detect sophisticated attacks in real-time left critical municipal services vulnerable. Legacy systems also struggled with the growing volume of network traffic, causing performance bottlenecks across multiple departments.",
    solution:
      "SOS Infocity deployed a comprehensive multi-layered security framework that revolutionized the state's network defense capabilities. The solution combined AI-driven threat detection algorithms with continuous perimeter telemetry monitoring, creating an intelligent security ecosystem. Automated incident response protocols were implemented to neutralize threats instantly, while a centralized command center provided unified visibility across all municipal nodes.",
    results: [
      "67% reduction in security incidents within first 6 months",
      "45% improvement in threat detection and response time",
      "99.9% network uptime achieved across all locations",
      "Real-time threat detection covering 200+ municipal locations",
      "75% reduction in false positive alerts",
    ],
  },
  {
    id: 4,
    num: "04",
    title: "Cloud & Data Platform Modernisation",
    subtitle:
      "Deploying high-efficiency zero-trust infrastructure layers for over 200+ active cross-regional corporate branch offices seamlessly.",
    img: "images/case_study_4.jpg",
    challenge:
      "The corporate network was burdened with legacy systems that created inconsistent security protocols across different regions. Data management was inefficient, with siloed information systems hampering business operations. Branch offices operated with varying levels of security compliance, creating significant risk exposure and operational inefficiencies.",
    solution:
      "A complete transformation of the enterprise infrastructure was executed through the implementation of zero-trust architecture. The solution included modern cloud-native platforms, centralized identity management, automated compliance monitoring, and seamless integration of over 200 branch offices. Advanced data governance frameworks ensured consistent security policies across all locations.",
    results: [
      "200+ branches fully integrated into unified platform",
      "40% improvement in overall system performance",
      "Zero-trust security architecture implemented enterprise-wide",
      "30% reduction in operational costs",
      "99.98% system availability achieved",
      "Automated compliance reporting across all regions",
    ],
  },

  {
    id: 5,
    num: "05",
    title: "Multi-Department Digital Rollout",
    subtitle:
      "Transforming internal communications and establishing modern data delivery loops for complex, layered industrial networks.",
    img: "images/case_study_5.jpg",
    challenge:
      "The organization faced significant operational inefficiencies due to disconnected communication systems and outdated data delivery methods. Departmental silos prevented effective collaboration, while legacy infrastructure couldn't support modern digital workflows. Information flow was slow and often unreliable, impacting decision-making across the enterprise.",
    solution:
      "Implementation of an integrated digital platform that revolutionized internal communications and data management. The solution included unified communications tools, automated data workflows, and collaborative platforms designed specifically for industrial environments. Modern data delivery loops were established to ensure real-time information flow across all departments.",
    results: [
      "75% improvement in internal communication efficiency",
      "Real-time data delivery across 20+ departments",
      "Seamless collaboration with unified communication platform",
      "50% reduction in operational delays",
      "Enhanced cross-departmental project coordination",
      "Digital transformation completed 3 months ahead of schedule",
    ],
  },
];

let currentView = "grid";
let currentCaseId = null;

const heroHeader = document.getElementById("heroHeader");
const heroContent = document.getElementById("heroContent");
const gridSection = document.getElementById("caseStudiesSection");
const detailSection = document.getElementById("detailSection");
const detailWrapper = document.getElementById("detailWrapper");
const blogGridTrack = document.getElementById("blogGridTrack");
const backButton = document.getElementById("backToCases");

function renderGrid() {
  if (!blogGridTrack) return;

  blogGridTrack.innerHTML = "";
  caseStudiesData.forEach((data) => {
    const card = document.createElement("div");
    card.className = "cs-card";
    card.setAttribute("data-id", data.id);

    card.addEventListener("click", function () {
      const id = parseInt(this.getAttribute("data-id"));
      showDetail(id);
    });

    card.innerHTML = `
      <div class="cs-num">${data.num}</div>
      <div class="cs-card-img-wrap">
        <img src="${data.img}" alt="${data.title}" loading="lazy">
      </div>
      <div class="cs-card-body">
        <h3>${data.title}</h3>
        <p>${data.subtitle}</p>
        <span class="card-footer-link">
          Read More <i class="fas fa-arrow-right"></i>
        </span>
      </div>
    `;
    blogGridTrack.appendChild(card);
  });
}

function showDetail(id) {
  const caseData = caseStudiesData.find((item) => item.id === id);
  if (!caseData) return;

  currentCaseId = id;
  currentView = "detail";

  // Update hero
  heroHeader.classList.add("detail-mode");
  heroContent.innerHTML = `
    <h1>${caseData.title}</h1>
    <p>${caseData.subtitle}</p>
  `;

  gridSection.classList.add("hidden");
  detailSection.classList.add("visible");
  detailSection.style.display = "block";

  detailWrapper.innerHTML = `
    <div class="cs-detail-grid">
      <div class="cs-detail-main">
        <div class="cs-detail-image-wrap">
          <img src="${caseData.img}" alt="${caseData.title}" loading="lazy">
        </div>
        <div class="cs-detail-body">
          <h2>${caseData.title}</h2>
          <p class="detail-subtitle">${caseData.subtitle}</p>
          <h3>Challenge</h3>
          <p class="detail-text">${caseData.challenge}</p>
          <h3>Solution</h3>
          <p class="detail-text">${caseData.solution}</p>
        </div>
      </div>
      <div class="cs-detail-sidebar">
        <div class="sidebar-card">
          <h4>Key Results</h4>
          <ul>
            ${caseData.results.map((result) => `<li>${result}</li>`).join("")}
          </ul>
        </div>
        
        <div class="sidebar-card">
          <h4>Need a Similar Solution?</h4>
          <p style="color: #4b5563; font-size: 0.95rem; margin-bottom: 16px;">
            Contact our team to discuss how we can help your organization.
          </p>
          <a href="contact.html" class="cta-btn">
            Get Started <i class="fas fa-arrow-right"></i>
          </a>
        </div>
      </div>
    </div>
  `;

  const url = new URL(window.location);
  url.searchParams.set("id", id);
  window.history.pushState({ id: id, view: "detail" }, "", url);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showGrid() {
  currentView = "grid";
  currentCaseId = null;

  // Reset hero
  heroHeader.classList.remove("detail-mode");
  heroContent.innerHTML = `
    <h1>Enterprise Case Studies</h1>
    <p>
      Real-world intelligence fields showcasing network optimization, deep machine learning integration, and
      hardened zero-trust data architectures.
    </p>
  `;

  gridSection.classList.remove("hidden");
  detailSection.classList.remove("visible");
  detailSection.style.display = "none";

  const url = new URL(window.location);
  url.searchParams.delete("id");
  window.history.pushState({ view: "grid" }, "", url);

  gridSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

if (backButton) {
  backButton.addEventListener("click", showGrid);
}

window.shareCase = function (platform, title) {
  const url = window.location.href;
  const shareData = {
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`Check out this case study: ${url}`)}`,
  };

  if (shareData[platform]) {
    window.open(shareData[platform], "_blank", "width=600,height=500");
  }
};

window.addEventListener("popstate", function (event) {
  if (event.state && event.state.view === "detail" && event.state.id) {
    showDetail(event.state.id);
  } else {
    showGrid();
  }
});

function checkUrlParams() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  if (id) {
    const caseId = parseInt(id);
    const exists = caseStudiesData.some((item) => item.id === caseId);
    if (exists) {
      showDetail(caseId);
      return;
    }
  }
  showGrid();
}

document.addEventListener("DOMContentLoaded", () => {
  renderGrid();
  checkUrlParams();
});
