const caseStudiesData = [
  {
    id: 1,
    title: "Intelligent Enforcement Management Systems (IEMS)",
    subtitle:
      "AI-powered enforcement and traffic analytics improve compliance, identify high-risk driving behaviour, and support faster incident response, contributing to a measurable reduction in road accidents and fatalities.",
    img: "images/IEMS.jpeg",
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

// Render Grid Cards
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
      <div class="cs-card-img-wrap">
        <img src="${data.img}" alt="${data.title}" loading="lazy">
      </div>
      <div class="cs-card-body">
        <h3>${data.title}</h3>
        <p>${data.subtitle}</p>
        <span class="card-footer-link">
          Read Case Study <i class="fas fa-arrow-right"></i>
        </span>
      </div>
    `;
    blogGridTrack.appendChild(card);
  });
}

// Show Case Study Article View
function showDetail(id) {
  const caseData = caseStudiesData.find((item) => item.id === id);
  if (!caseData) return;

  currentCaseId = id;
  currentView = "detail";

  // Hide Grid & Show Detail Section
  gridSection.classList.add("hidden");
  detailSection.classList.add("visible");
  detailSection.style.display = "block";

  // If case study ID is 1, insert the full HTML structure
  if (id === 1) {
    const caseStudyTemplate = document.getElementById("iems-case-study-template");
    if (caseStudyTemplate) {
      detailWrapper.innerHTML = caseStudyTemplate.innerHTML;
    }
  }

  // Update URL history state
  const url = new URL(window.location);
  url.searchParams.set("id", id);
  window.history.pushState({ id: id, view: "detail" }, "", url);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Return back to Case Studies Grid View
function showGrid() {
  currentView = "grid";
  currentCaseId = null;

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