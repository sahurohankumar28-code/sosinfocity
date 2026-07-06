/**
 * SOS Infocity - Unified Architecture Core Custom Build
 */
(function () {
  "use strict";

  if (history.scrollRestoration) {
    history.scrollRestoration = "manual";
  }
  window.addEventListener("beforeunload", () => {
    window.scrollTo(0, 0);
  });
  window.scrollTo(0, 0);

  function animateCounter(elementId, targetValue, duration = 2800) {
    const element = document.getElementById(elementId);
    if (!element) return;

    let current = 0;
    const stepTime = 16;
    const increments = targetValue / (duration / stepTime);

    const timer = setInterval(() => {
      current += increments;
      if (current >= targetValue) {
        element.innerText = targetValue;
        clearInterval(timer);
      } else {
        element.innerText = Math.floor(current);
      }
    }, stepTime);
  }

  function initMobileNavigation() {
    const mobileBtn = document.getElementById("mobileMenuBtn");
    const overlay = document.getElementById("mobileNavOverlay");
    const closeBtn = document.getElementById("closeMobileBtn");

    if (!mobileBtn || !overlay || !closeBtn) return;

    const openMenu = () => overlay.classList.add("open");
    const closeMenu = () => overlay.classList.remove("open");

    mobileBtn.addEventListener("click", openMenu);
    closeBtn.addEventListener("click", closeMenu);
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeMenu();
    });
  }

  function initPerspectiveController() {
    const stage = document.querySelector(".marquee-display-pane");
    const display = document.querySelector(".led-tv-display-curve");

    if (!stage || !display || window.innerWidth <= 1024) return;

    let frameId;

    stage.addEventListener("mousemove", (e) => {
      if (frameId) cancelAnimationFrame(frameId);

      frameId = requestAnimationFrame(() => {
        const rect = stage.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        const rotateX = -(y / rect.height) * 2.5;
        const rotateY = (x / rect.width) * 2.5;

        display.style.transform = `rotateX(${1 + rotateX}deg) rotateY(${6 + rotateY}deg) translateZ(0px)`;
      });
    });

    stage.addEventListener("mouseleave", () => {
      if (frameId) cancelAnimationFrame(frameId);
      display.style.transform = `rotateX(1deg) rotateY(6deg) translateZ(0px)`;
    });
  }

  function initMarqueeInteractions() {
    const track = document.getElementById("testimonialMarqueeTrack");
    if (!track) return;

    track.addEventListener("mouseenter", () => {
      track.style.animationPlayState = "paused";
    });

    track.addEventListener("mouseleave", () => {
      track.style.animationPlayState = "running";
    });
  }

  // SCROLL TIMELINE GRAPH DRAW ENGINE
  function initScrollTimelineEngine() {
    const path = document.getElementById("roadProgressPath");
    const targetSection = document.querySelector(".journey-section");
    const sectionHeader = document.querySelector(
      ".journey-section .section-header",
    );
    const nodes = document.querySelectorAll(".road-milestone-landmark");

    if (!targetSection || !nodes.length) return;

    const isMobileLayout = () => window.innerWidth <= 1024;

    let pathLength = 0;
    if (path) {
      pathLength = path.getTotalLength();
      path.style.strokeDasharray = pathLength;
      path.style.strokeDashoffset = pathLength;
    }

    function updateTimelineScrollState() {
      // MOBILE SCROLL POPUP ENGINE
      if (isMobileLayout()) {
        const triggerBottom = window.innerHeight * 0.85; // Element pops up when 15% from bottom viewport edge

        nodes.forEach((node) => {
          const nodeTop = node.getBoundingClientRect().top;

          if (nodeTop < triggerBottom) {
            node.classList.add("node-activated");
          } else {
            node.classList.remove("node-activated"); // Optional: Keeps animation reusable up and down
          }
        });
        return;
      }

      // DESKTOP SVG ENGAGEMENT ENGINE
      if (!path || !sectionHeader) return;

      const headerRect = sectionHeader.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const triggerPoint = windowHeight * 0.8;
      let progress = 0;

      if (headerRect.top <= triggerPoint) {
        const totalScrollableDistance =
          targetSection.offsetHeight - (windowHeight - triggerPoint);
        const scrolledDistance = triggerPoint - headerRect.top;

        progress = scrolledDistance / totalScrollableDistance;
        progress = Math.max(0, Math.min(1, progress));
      }

      path.style.strokeDashoffset = pathLength - progress * pathLength;

      nodes.forEach((node, index) => {
        const nodeTriggerOffset = (index + 0.2) / nodes.length;
        if (progress >= nodeTriggerOffset) {
          node.classList.add("node-activated");
        } else {
          node.classList.remove("node-activated");
        }
      });
    }

    window.addEventListener("scroll", updateTimelineScrollState, {
      passive: true,
    });
    window.addEventListener("resize", updateTimelineScrollState);
    updateTimelineScrollState();
  }

  const runSystemInitializations = () => {
    window.scrollTo(0, 0);
    initMobileNavigation();
    initPerspectiveController();
    initMarqueeInteractions();
    initScrollTimelineEngine();

    animateCounter("projectsCount", 185, 2600);
    animateCounter("clientsCount", 340, 2600);
  };

  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    runSystemInitializations();
  } else {
    document.addEventListener("DOMContentLoaded", runSystemInitializations);
  }
})();
