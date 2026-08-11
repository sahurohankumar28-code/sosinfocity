const caseStudiesData = [
  {
    id: 1,
    title: "Intelligent Enforcement Management Systems (IEMS)",
    subtitle:
      "AI-powered enforcement and traffic analytics improve compliance, identify high-risk driving behaviour, and support faster incident response, contributing to a measurable reduction in road accidents and fatalities.",
    img: "images/IEMS4.jpeg",
    templateId: "template-cs-1"
  },
  {
    id: 2,
    title: "State Network Infrastructure",
    subtitle:
      "High-speed, carrier-grade digital backbone linking state headquarters, district offices, and rural administrative nodes with redundant fiber connectivity.",
    img: "images/oswan1.jpg",
    templateId: "template-cs-3"
  },
  {
    id: 3,
    title: "City Surveillance & Monitoring Integration",
    subtitle:
      "Integrated urban security networks, high-speed fiber backbones, and Unified Command & Control Centres (UCCC) providing automated threat detection and real-time operational visibility.",
    img: "images/cloud_1.png",
    templateId: "template-cs-2"
  },
  
  {
    id: 4,
    title: "Cloud & Data Platform Modernisation",
    subtitle:
      "Scalable cloud migration, containerized microservices architecture, automated disaster recovery, and enterprise big data analytics platforms.",
    img: "images/Cloud.png",
    templateId: "template-cs-4"
  },
  {
    id: 5,
    title: "Multi-Department Digital Rollout",
    subtitle:
      "Unified service delivery portals, digital workflow automation, and single-sign-on integration across multi-department public services.",
    img: "images/multi1.jpg",
    templateId: "template-cs-5"
  }
];

let currentView = "grid";
let currentCaseId = null;
let sliderInterval = null;

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

// Initialize Hero Slider (Gracefully checks if slider elements exist inside the target template)
function initHeroSlider() {
  const track = document.getElementById("heroSliderTrack");
  const prevBtn = document.getElementById("sliderPrevBtn");
  const nextBtn = document.getElementById("sliderNextBtn");
  const dotsContainer = document.getElementById("sliderDots");

  if (!track || !prevBtn || !nextBtn || !dotsContainer) return;

  if (track.dataset.initialized === "true") return;

  let originalSlides = Array.from(track.querySelectorAll(".slide"));
  const originalLength = originalSlides.length;
  if (originalLength <= 1) return;

  const firstClone = originalSlides[0].cloneNode(true);
  const lastClone = originalSlides[originalLength - 1].cloneNode(true);

  track.appendChild(firstClone);
  track.insertBefore(lastClone, originalSlides[0]);

  let currentIndex = 1;
  let isTransitioning = false;
  const dots = dotsContainer.querySelectorAll(".dot");

  track.style.transition = "none";
  track.style.transform = `translateX(-${currentIndex * 100}%)`;

  function updateDots(activeIdx) {
    dots.forEach((dot, idx) => {
      dot.classList.toggle("active", idx === activeIdx);
    });
  }

  function moveSlider(index, animated = true) {
    if (animated) {
      track.style.transition = "transform 0.5s ease-in-out";
      isTransitioning = true;
    } else {
      track.style.transition = "none";
    }
    currentIndex = index;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    let dotIdx = (currentIndex - 1 + originalLength) % originalLength;
    updateDots(dotIdx);
  }

  track.addEventListener("transitionend", () => {
    isTransitioning = false;
    if (currentIndex === 0) {
      moveSlider(originalLength, false);
    } else if (currentIndex === originalLength + 1) {
      moveSlider(1, false);
    }
  });

  function nextSlide() {
    if (isTransitioning) return;
    moveSlider(currentIndex + 1);
  }

  function prevSlide() {
    if (isTransitioning) return;
    moveSlider(currentIndex - 1);
  }

  function startAutoSlide() {
    if (sliderInterval) clearInterval(sliderInterval);
    sliderInterval = setInterval(nextSlide, 4000);
  }

  function resetAutoSlide() {
    clearInterval(sliderInterval);
    startAutoSlide();
  }

  nextBtn.addEventListener("click", () => {
    nextSlide();
    resetAutoSlide();
  });

  prevBtn.addEventListener("click", () => {
    prevSlide();
    resetAutoSlide();
  });

  dots.forEach((dot) => {
    dot.addEventListener("click", function () {
      if (isTransitioning) return;
      const targetDotIdx = parseInt(this.getAttribute("data-slide"));
      moveSlider(targetDotIdx + 1);
      resetAutoSlide();
    });
  });

  track.dataset.initialized = "true";
  startAutoSlide();
}

// Show Case Study Detail View
function showDetail(id) {
  const caseData = caseStudiesData.find((item) => item.id === id);
  if (!caseData) return;

  currentCaseId = id;
  currentView = "detail";

  gridSection.classList.add("hidden");
  detailSection.classList.add("visible");
  detailSection.style.display = "block";

  const caseStudyTemplate = document.getElementById(caseData.templateId);
  if (caseStudyTemplate) {
    detailWrapper.innerHTML = caseStudyTemplate.innerHTML;
    initHeroSlider();
  }

  const url = new URL(window.location);
  url.searchParams.set("id", id);
  window.history.pushState({ id: id, view: "detail" }, "", url);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Return to Grid View
function showGrid() {
  if (sliderInterval) clearInterval(sliderInterval);

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