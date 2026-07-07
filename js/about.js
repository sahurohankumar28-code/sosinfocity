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

  function initScrollTimelineEngine() {
    const path = document.getElementById("roadProgressPath");
    const arrow = document.getElementById("roadArrow");
    const targetSection = document.querySelector(".journey-section");
    const timelineContainer = document.querySelector(".road-timeline-container"); // Track the row container directly
    const nodes = document.querySelectorAll(".road-milestone-landmark");

    if (!targetSection || !timelineContainer || !nodes.length) return;

    const isMobileLayout = () => window.innerWidth <= 1024;

    let pathLength = 0;
    if (path) {
      pathLength = path.getTotalLength();
      path.style.strokeDasharray = pathLength;
      path.style.strokeDashoffset = pathLength;
    }

    function updateTimelineScrollState() {
      if (isMobileLayout()) {
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

      if (!path) return;

      // Measure relative to the milestone row container, not the section header
      const containerRect = timelineContainer.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Starts exactly when the 2016/timeline row enters the viewport area (at 85% from top)
      const startTrigger = windowHeight * 0.85; 
      const endTrigger = -containerRect.height + windowHeight * 0.4;

      let progress = 0;

      if (containerRect.top <= startTrigger) {
        const totalDistance = startTrigger - endTrigger;
        const traveledDistance = startTrigger - containerRect.top;

        progress = traveledDistance / totalDistance;
        progress = Math.max(0, Math.min(1, progress));
      }

      const currentLength = progress * pathLength;
      path.style.strokeDashoffset = pathLength - currentLength;

      // Real-time vector tangent calculation for arrowhead scaling and rotation
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
          // Keep arrow visible but locked at the 2016 starting node coordinates when progress is 0
          arrow.style.opacity = "1";
          const startPoint = path.getPointAtLength(0);
          const nextPoint = path.getPointAtLength(2);
          const angle = Math.atan2(nextPoint.y - startPoint.y, nextPoint.x - startPoint.x) * (180 / Math.PI);
          arrow.setAttribute("transform", `translate(${startPoint.x}, ${startPoint.y}) rotate(${angle})`);
        }
      }

      nodes.forEach((node, index) => {
        const nodeTriggerOffset = index / nodes.length;
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