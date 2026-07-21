(function () {
  "use strict";

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

  function initCountersOnScroll() {
    const statsSection = document.querySelector(".stats-row-fullwidth");
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
    checkVisibility();
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

  function setupMobileObserver(nodes, mobileObserver) {
    if (mobileObserver) mobileObserver.disconnect();

    mobileObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("node-activated");
          }
        });
      },
      { root: null, threshold: 0.18, rootMargin: "0px 0px -50px 0px" }
    );

    nodes.forEach((node) => {
      node.classList.remove("node-activated");
      mobileObserver.observe(node);
    });

    return mobileObserver;
  }

  function updateArrowRotation(arrow, path, currentLength, pathLength) {
    if (currentLength > 0) {
      arrow.style.opacity = "1";
      const point = path.getPointAtLength(currentLength);
      const lookAheadLength = Math.min(pathLength, currentLength + 2);
      const aheadPoint = path.getPointAtLength(lookAheadLength);

      const deltaX = aheadPoint.x - point.x;
      const deltaY = aheadPoint.y - point.y;
      const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

      arrow.setAttribute("transform", `translate(${point.x}, ${point.y}) rotate(${angle})`);
    } else {
      arrow.style.opacity = "0";
    }
  }

  function updateNodeActivation(nodes, progress) {
    nodes.forEach((node, index) => {
      const activateThreshold = index / nodes.length - 0.04;
      if (progress >= Math.max(0, activateThreshold)) {
        node.classList.add("node-activated");
      } else {
        node.classList.remove("node-activated");
      }
    });
  }

  function initScrollTimelineEngine() {
    const path = document.getElementById("roadProgressOverlay");
    const arrow = document.getElementById("roadArrow");
    const targetSection = document.getElementById("roadTimelineSection");
    const timelineContainer = document.getElementById("roadCanvas");
    const nodes = document.querySelectorAll(".road-milestone-landmark");

    if (!targetSection || !timelineContainer || !nodes.length) return;

    let ticking = false;
    let mobileObserver = null;

    const isMobileLayout = () => window.innerWidth <= 1024;

    let pathLength = 0;
    if (path) {
      pathLength = path.getTotalLength();
      path.style.strokeDasharray = pathLength;
      path.style.strokeDashoffset = pathLength;
    }

    function handleMobileLayout() {
      targetSection.style.height = "auto";
      timelineContainer.style.position = "relative";
      timelineContainer.style.top = "auto";
      if (arrow) arrow.style.opacity = "0";
      mobileObserver = setupMobileObserver(nodes, mobileObserver);
    }

    function updateTimelineForDesktop() {
      if (isMobileLayout()) {
        handleMobileLayout();
        return;
      }

      if (mobileObserver) mobileObserver.disconnect();

      targetSection.style.position = "relative";
      targetSection.style.height = "1020px";
      timelineContainer.style.position = "sticky";
      timelineContainer.style.top = "0";

      const sectionRect = targetSection.getBoundingClientRect();
      const totalScrollRunway = targetSection.offsetHeight - timelineContainer.offsetHeight;

      let progress = -sectionRect.top / totalScrollRunway;
      progress = Math.max(0, Math.min(1, progress));

      if (path) {
        const currentLength = progress * pathLength;
        path.style.strokeDashoffset = pathLength - currentLength;

        if (arrow && progress > 0.001) {
          updateArrowRotation(arrow, path, currentLength, pathLength);
        } else if (arrow) {
          arrow.style.opacity = "0";
        }
      }

      updateNodeActivation(nodes, progress);
    }

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!isMobileLayout()) updateTimelineForDesktop();
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", () => {
      if (isMobileLayout()) {
        handleMobileLayout();
      } else {
        updateTimelineForDesktop();
      }
    });

    if (isMobileLayout()) {
      handleMobileLayout();
    } else {
      updateTimelineForDesktop();
    }
  }

  const runSystemInitializations = () => {
    initPerspectiveController();
    initMarqueeInteractions();
    initScrollTimelineEngine();
    initCountersOnScroll();
  };

  if (document.readyState === "complete" || document.readyState === "interactive") {
    runSystemInitializations();
  } else {
    document.addEventListener("DOMContentLoaded", runSystemInitializations);
  }
})();