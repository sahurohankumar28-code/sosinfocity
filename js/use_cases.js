const caseStudiesData = [
  {
    id: 1,
    title: "Intelligent Enforcement Management System (IEMS)",
    subtitle: "AI-powered enforcement and traffic analytics improve compliance, identify high-risk driving behaviour, and support faster incident response, contributing to a measurable reduction in road accidents and fatalities.",
    img: "images/IEMS4.webp",
    templateId: "template-cs-1"
  },
  {
  id: 2,
  title: "State Network Infrastructure",
  subtitle: "High-availability enterprise SWAN backbone connecting State, District, and Block headquarters with carrier-grade MPLS routing, unified cyber defense, and 24×7 NOC monitoring to power seamless e-Governance.",
  img: "images/oswan1.webp",
  templateId: "template-cs-2"
},
{
  id: 3,
  title: "Cloud & Data Platform Modernisation",
  subtitle: "Transforming legacy on-premise environments into scalable hybrid cloud architectures with zero-downtime migration, container orchestration, enterprise data lakes, and automated BCDR.",
  img: "images/Cloud_1.webp",
  templateId: "template-cs-3"
},
{
  id: 4,
  title: "Multi-Department Digital Rollout",
  subtitle: "Unifying disparate administrative systems into a secure, single-pane digital platform with automated file workflows, SSO directory integration, Master Data Management, and real-time executive analytics.",
  img: "images/Cloud.webp",
  templateId: "template-cs-4"
},
{
  id: 5,
  title: "City Surveillance & Monitoring Integration",
  subtitle: "Establishing an enterprise municipal surveillance ecosystem uniting HD optical edge cameras, fiber-optic ring backbones, a 24×7 Unified Command & Control Centre (UCCC), and an evidence-grade VMS platform.",
  img: "images/case_study_1.webp",
  templateId: "template-cs-5"
}
];

let sliderInterval = null;

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

function initHeroSlider() {
  const track = document.getElementById("heroSliderTrack");
  const prevBtn = document.getElementById("sliderPrevBtn");
  const nextBtn = document.getElementById("sliderNextBtn");
  const dotsContainer = document.getElementById("sliderDots");

  if (!track || !prevBtn || !nextBtn || !dotsContainer) return;
  if (track.dataset.initialized === "true") return;

  const originalSlides = Array.from(track.querySelectorAll(".slide"));
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

    const dotIdx = (currentIndex - 1 + originalLength) % originalLength;
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

function showDetail(id) {
  const caseData = caseStudiesData.find((item) => item.id === id);
  if (!caseData) return;

  gridSection.classList.add("hidden");
  detailSection.classList.remove("hidden");

  const caseStudyTemplate = document.getElementById(caseData.templateId);
  if (caseStudyTemplate) {
    detailWrapper.innerHTML = caseStudyTemplate.innerHTML;
    initHeroSlider();
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showGrid() {
  if (sliderInterval) {
    clearInterval(sliderInterval);
    sliderInterval = null;
  }

  gridSection.classList.remove("hidden");
  detailSection.classList.add("hidden");
  detailWrapper.innerHTML = "";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

if (backButton) {
  backButton.addEventListener("click", showGrid);
}

document.addEventListener("DOMContentLoaded", () => {
  renderGrid();
});