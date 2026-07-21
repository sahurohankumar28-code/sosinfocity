(function () {
  "use strict";

  if (history.scrollRestoration) {
    history.scrollRestoration = "manual";
  }
  window.addEventListener("beforeunload", () => {
    window.scrollTo(0, 0);
  });
  window.scrollTo(0, 0);

  function initProductStacking() {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined")
      return;

    gsap.registerPlugin(ScrollTrigger);

    const cards = gsap.utils.toArray(".c-card");
    if (cards.length === 0) return;

    ScrollTrigger.matchMedia({
      "(min-width: 769px)": function () {
        cards.forEach((card, index) => {
          const scaleValue = 1 - (cards.length - 1 - index) * 0.05;

          ScrollTrigger.create({
            trigger: card,
            start: "top 12%",
            endTrigger: "#cardsStack",
            end: "bottom 80%",
            pin: true,
            pinSpacing: false,
            scrub: true,
            invalidateOnRefresh: true,
            animation: gsap.to(card, {
              scale: scaleValue,
              opacity: 1,
              ease: "none",
            }),
          });
        });
      },
      "(max-width: 768px)": function () {
        ScrollTrigger.getAll().forEach((t) => {
          if (t.trigger && t.trigger.classList.contains("c-card")) t.kill(true);
        });
      },
    });
  }

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

  function setupScrollTriggeredCounters() {
    const statsRow = document.querySelector(".stats-row");
    if (!statsRow) return;

    const observer = new IntersectionObserver(
      (entries, observerInstance) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter("projectsCount", 185, 2500);
            animateCounter("clientsCount", 340, 2500);
            observerInstance.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 },
    );
    observer.observe(statsRow);
  }

  let currentCoverflowIndex = 0;
  let coverflowCards = [];
  let coverflowAutoTimer = null;
  const autoCycleInterval = 4000;
  let ticking = false; // Prevents layout thrashing by batching frame requests

  function updateCoverflowLayout() {
    if (ticking) return;
    ticking = true;

    requestAnimationFrame(() => {
      const stage = document.getElementById("industriesStage");
      if (!stage) {
        ticking = false;
        return;
      }

      coverflowCards = Array.from(stage.children);
      const totalCards = coverflowCards.length;
      if (totalCards === 0) {
        ticking = false;
        return;
      }

      const isMobile = window.innerWidth <= 768;
      const xOffsetDelta = isMobile ? 40 : 160;
      const zOffsetDelta = isMobile ? 60 : 120;

      coverflowCards.forEach((card, index) => {
        card.classList.remove("active-center");

        let offset = index - currentCoverflowIndex;
        if (offset > totalCards / 2) offset -= totalCards;
        if (offset < -totalCards / 2) offset += totalCards;

        let absOffset = Math.abs(offset);

        if (offset === 0) {
          card.classList.add("active-center");
          card.style.transform = `translate3d(0px, 0px, 150px) rotateY(0deg)`;
          card.style.zIndex = "40";
          card.style.opacity = "1";
          card.style.pointerEvents = "auto";
        } else {
          let direction = offset > 0 ? 1 : -1;
          let translateX = direction * xOffsetDelta + offset * 20;
          let scale = 1 - absOffset * 0.12;
          let translateZ = 0 - absOffset * zOffsetDelta;
          let rotateY = direction * -25;
          let opacity = 0.8 - absOffset * 0.25;

          card.style.transform = `translate3d(${translateX}px, 0px, ${translateZ}px) scale(${scale}) rotateY(${rotateY}deg)`;
          card.style.zIndex = String(40 - absOffset);
          card.style.opacity = String(Math.max(opacity, 0));
          card.style.pointerEvents = absOffset <= 1 ? "auto" : "none";
        }
      });
      updateCoverflowDots(totalCards);
      ticking = false;
    });
  }

  function buildCoverflowDots(total) {
    const dotsBox = document.getElementById("coverflowDots");
    if (!dotsBox) return;
    dotsBox.innerHTML = "";
    for (let i = 0; i < total; i++) {
      const dot = document.createElement("div");
      dot.className = `dot ${i === currentCoverflowIndex ? "active" : ""}`;
      dot.addEventListener("click", () => {
        currentCoverflowIndex = i;
        updateCoverflowLayout();
        restartCoverflowPlaybackLoop();
      });
      dotsBox.appendChild(dot);
    }
  }

  function updateCoverflowDots(total) {
    const dotsBox = document.getElementById("coverflowDots");
    if (!dotsBox || dotsBox.children.length === 0) {
      buildCoverflowDots(total);
      return;
    }
    Array.from(dotsBox.children).forEach((dot, index) => {
      dot.classList.toggle("active", index === currentCoverflowIndex);
    });
  }

  function shiftCoverflow(direction) {
    const stage = document.getElementById("industriesStage");
    if (!stage) return;
    const total = stage.children.length;
    if (total === 0) return;

    currentCoverflowIndex = (currentCoverflowIndex + direction + total) % total;
    updateCoverflowLayout();
  }

  window.shiftCoverflow = function (direction) {
    shiftCoverflow(direction);
    restartCoverflowPlaybackLoop();
  };

  function startCoverflowPlaybackLoop() {
    if (coverflowAutoTimer) clearInterval(coverflowAutoTimer);
    coverflowAutoTimer = setInterval(() => {
      shiftCoverflow(1);
    }, autoCycleInterval);
  }

  function restartCoverflowPlaybackLoop() {
    startCoverflowPlaybackLoop();
  }

  const partnerLogos = [
    "images/allied.png",
    "images/SonicWall.png",
    "images/aruba.png",
    "images/Microsoft.png",
    "images/Cambium.png",
    "images/Cisco.png",
    "images/D-Link.png",
    "images/Jio.png",
    "images/Digisol.png",
    "images/HPE.png",
    "images/juniper.png",
    "images/Red_Hat.png",
    "images/SE.png",
    "images/Ruckus.png",
    "images/Honeywell.png",
    "images/Airtel.png",
    "images/LG.png",
    "images/NETGEAR.png",
    "images/AWS.png",
    "images/Peplink.png",
    "images/Railtel.png",
    "images/Mikrotik.png",
    "images/Bosch.png",
    "images/Dell_EMC.png",
    "images/IBM.png",
    "images/sophos.png",
  ];

  function getLogoPath(filename) {
    return [
      `images/${filename}`,
      `assets/images/${filename}`,
      `assets/${filename}`,
      `img/${filename}`,
      `partner-logos/${filename}`,
      `logos/${filename}`,
      `${filename}`,
    ];
  }

  function renderPartners() {
    const partnerTrack = document.getElementById("partnerTrack");
    if (!partnerTrack) return;

    partnerTrack.innerHTML = "";
    const doubledLogos = [...partnerLogos, ...partnerLogos];

    doubledLogos.forEach((logo, index) => {
      const item = document.createElement("div");
      item.className = "partner-item";
      if (index >= partnerLogos.length)
        item.setAttribute("aria-hidden", "true");

      const img = document.createElement("img");
      img.className = "partner-logo";
      img.alt = logo.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
      img.loading = "lazy";

      const paths = getLogoPath(logo);
      let currentPathIndex = 0;

      function tryNextPath() {
        if (currentPathIndex < paths.length) {
          img.src = paths[currentPathIndex];
          currentPathIndex++;
        } else {
          img.style.display = "none";
          const fallback = document.createElement("span");
          fallback.className = "partner-fallback";
          fallback.style.color = "#475569";
          fallback.style.fontWeight = "600";
          fallback.style.fontSize = "0.85rem";
          fallback.textContent = img.alt.toUpperCase();
          item.appendChild(fallback);
        }
      }

      img.onerror = tryNextPath;
      tryNextPath();
      item.appendChild(img);
      partnerTrack.appendChild(item);
    });
  }

  function initializeAllComponents() {
    try {
      renderPartners();
    } catch (err) {
      console.error("Partners marquee load failure:", err);
    }

    setupScrollTriggeredCounters();
    initProductStacking();

    const stage = document.getElementById("industriesStage");
    if (stage) {
      buildCoverflowDots(stage.children.length);
      Array.from(stage.children).forEach((card, index) => {
        card.addEventListener("click", () => {
          currentCoverflowIndex = index;
          updateCoverflowLayout();
          restartCoverflowPlaybackLoop();
        });
      });
      updateCoverflowLayout();
      startCoverflowPlaybackLoop();
    }

    let resizeTimeout;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(updateCoverflowLayout, 100);
    });

    const heroVideo = document.querySelector(".hero-video");
    if (heroVideo)
      heroVideo.play().catch(() => console.log("Autoplay blocked"));
  }

  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    initializeAllComponents();
  } else {
    window.addEventListener("DOMContentLoaded", initializeAllComponents);
  }
})();
