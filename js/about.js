(function () {
  "use strict";

  if (history.scrollRestoration) {
    history.scrollRestoration = "manual";
  }
  window.addEventListener("beforeunload", () => {
    window.scrollTo(0, 0);
  });
  window.scrollTo(0, 0);

  /**
   * Smoothly animates numerical statistic nodes from zero up to the target values
   */
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

  /**
   * Triggers counter animations when stats section comes into view
   */
  function initCountersOnScroll() {
    const statsSection = document.querySelector('.stats-row-fullwidth');
    if (!statsSection) return;

    let countersStarted = false;

    const checkVisibility = () => {
      const rect = statsSection.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

      if (isVisible && !countersStarted) {
        countersStarted = true;
        animateCounter("projectsCount", 185, 2600);
        animateCounter("clientsCount", 340, 2600);
        window.removeEventListener("scroll", checkVisibility);
        window.removeEventListener("resize", checkVisibility);
      }
    };

    window.addEventListener("scroll", checkVisibility, { passive: true });
    window.addEventListener("resize", checkVisibility, { passive: true });
    // Check immediately in case it's already visible
    checkVisibility();
  }

  /**
   * Initializes responsive sliding side-drawer behaviors for small devices
   */
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

  /**
   * Drives subtle mouse-tracking physics on the 3D-curved workspace gallery canvas
   */
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

  /**
   * Manages state interruptions when a cursor anchors over the continuous testimonial carousel
   */
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

  /**
   * SCROLL-DRIVEN PINNING HIGHWAY ENGINE
   * Pins the timeline section to prevent normal down-paging until the path completes tracking.
   */
  function initScrollTimelineEngine() {
    const path = document.getElementById("roadProgressOverlay");
    const arrow = document.getElementById("roadArrow");
    const targetSection = document.getElementById("roadTimelineSection");
    const timelineContainer = document.getElementById("roadCanvas"); 
    const nodes = document.querySelectorAll(".road-milestone-landmark");
    const progressFill = document.getElementById("journeyProgressFill");
    const progressPercent = document.getElementById("journeyProgressPercent");

    if (!targetSection || !timelineContainer || !nodes.length) return;

    const isMobileLayout = () => window.innerWidth <= 1024;

    let pathLength = 0;
    if (path) {
      pathLength = path.getTotalLength();
      path.style.strokeDasharray = pathLength;
      path.style.strokeDashoffset = pathLength;
    }

    // Allocate runway height space and activate sticky pinning setup parameters
    if (!isMobileLayout()) {
      targetSection.style.position = "relative";
      targetSection.style.height = "1020px"; 
      timelineContainer.style.position = "sticky";
      timelineContainer.style.top = "0"; 
    }

    function updateTimelineScrollState() {
      if (isMobileLayout()) {
        targetSection.style.height = "auto";
        timelineContainer.style.position = "relative";
        timelineContainer.style.top = "auto";
        
        if (arrow) arrow.style.opacity = "0";
        const triggerBottom = window.innerHeight * 0.85; 

        nodes.forEach((node) => {
          const nodeTop = node.getBoundingClientRect().top;
          if (nodeTop < triggerBottom) {
            node.classList.add("node-activated");
          } else {
            node.classList.remove("node-activated"); 
          }
        });
        return;
      }

      // Calculations relative to the overall runway section
      const sectionRect = targetSection.getBoundingClientRect();
      const totalScrollRunway = targetSection.offsetHeight - timelineContainer.offsetHeight;
      
      let progress = -sectionRect.top / totalScrollRunway;
      progress = Math.max(0, Math.min(1, progress));

      // Update progress indicator
      if (progressFill) {
        progressFill.style.width = (progress * 100) + "%";
      }
      if (progressPercent) {
        progressPercent.textContent = Math.round(progress * 100) + "%";
      }

      if (path) {
        const currentLength = progress * pathLength;
        path.style.strokeDashoffset = pathLength - currentLength;

        if (arrow) {
          if (progress > 0.001) {
            arrow.style.opacity = "1";
            const point = path.getPointAtLength(currentLength);
            const lookAheadLength = Math.min(pathLength, currentLength + 2);
            const aheadPoint = path.getPointAtLength(lookAheadLength);
            
            const deltaX = aheadPoint.x - point.x;
            const deltaY = aheadPoint.y - point.y;
            const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
            
            arrow.setAttribute("transform", `translate(${point.x}, ${point.y}) rotate(${angle})`);
          } else {
            arrow.style.opacity = "1";
            const startPoint = path.getPointAtLength(0);
            const nextPoint = path.getPointAtLength(2);
            const angle = Math.atan2(nextPoint.y - startPoint.y, nextPoint.x - startPoint.x) * (180 / Math.PI);
            arrow.setAttribute("transform", `translate(${startPoint.x}, ${startPoint.y}) rotate(${angle})`);
          }
        }
      }

      // Activate nodes systematically as the vector stroke moves through their index segment
      nodes.forEach((node, index) => {
        const activateThreshold = (index / nodes.length) - 0.04;
        
        if (progress >= Math.max(0, activateThreshold)) {
          node.classList.add("node-activated");
        } else {
          node.classList.remove("node-activated");
        }
      });
    }

    window.addEventListener("scroll", updateTimelineScrollState, { passive: true });
    window.addEventListener("resize", () => {
      if (!isMobileLayout()) {
        targetSection.style.height = "1000px";
        timelineContainer.style.position = "sticky";
        timelineContainer.style.top = "0";
      }
      updateTimelineScrollState();
    });
    updateTimelineScrollState();
  }

  /**
   * Core orchestrator entry point
   */
  const runSystemInitializations = () => {
    window.scrollTo(0, 0);
    initMobileNavigation();
    initPerspectiveController();
    initMarqueeInteractions();
    initScrollTimelineEngine();
    initCountersOnScroll(); // Initialize counters on scroll instead of immediately
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