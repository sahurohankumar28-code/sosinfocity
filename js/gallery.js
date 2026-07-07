
(function () {
  "use strict";

  if (history.scrollRestoration) {
    history.scrollRestoration = "manual";
  }
  window.addEventListener("beforeunload", () => {
    window.scrollTo(0, 0);
  });
  window.scrollTo(0, 0);

  function initMobileNavigation() {
    const mobileBtn = document.getElementById("mobileMenuBtn");
    const overlay = document.getElementById("mobileNavOverlay");
    const closeBtn = document.getElementById("closeMobileBtn");

    if (!mobileBtn || !overlay || !closeBtn) return;

    mobileBtn.addEventListener("click", () => overlay.classList.add("open"));
    closeBtn.addEventListener("click", () => overlay.classList.remove("open"));

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) overlay.classList.remove("open");
    });
  }

  function initGridFilteringEngine() {
    const filterButtons = document.querySelectorAll(".filter-btn");
    const gridItems = document.querySelectorAll(".matrix-card");
    const gridContainer = document.getElementById("galleryGrid");

    if (!filterButtons.length || !gridItems.length || !gridContainer) return;

    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        filterButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");

        const targetFilter = button.getAttribute("data-filter");

        gridItems.forEach((item) => {
          const itemCategory = item.getAttribute("data-category");

          if (targetFilter === "all" || itemCategory === targetFilter) {
            item.classList.remove("hidden");
          } else {
            item.classList.add("hidden");
          }
        });
      });
    });
  }

  function initLightboxMediaViewer() {
    const cards = document.querySelectorAll(".matrix-card-inner");
    const lightbox = document.getElementById("matrixLightbox");
    const lightboxImg = document.getElementById("lightboxImage");
    const lightboxCap = document.getElementById("lightboxCaption");
    const closeBtn = document.getElementById("closeLightbox");
    const overlay = lightbox
      ? lightbox.querySelector(".lightbox-overlay")
      : null;

    if (!cards.length || !lightbox || !lightboxImg || !lightboxCap || !closeBtn)
      return;

    
    cards.forEach((card) => {
      card.addEventListener("click", () => {
        const imgSource = card
          .querySelector(".gallery-img")
          .getAttribute("src");
        const titleText = card.querySelector("h3").innerText;

        lightboxImg.setAttribute("src", imgSource);
        lightboxCap.innerText = titleText;

        lightbox.classList.add("active");
        lightbox.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden"; 
        
      });
    });

    
    const deactivateLightbox = () => {
      lightbox.classList.remove("active");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      setTimeout(() => {
        lightboxImg.setAttribute("src", "");
      }, 300); 
      
    };

    closeBtn.addEventListener("click", deactivateLightbox);
    if (overlay) overlay.addEventListener("click", deactivateLightbox);

    
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && lightbox.classList.contains("active")) {
        deactivateLightbox();
      }
    });
  }

  
  const bootGallerySystems = () => {
    initMobileNavigation();
    initGridFilteringEngine();
    initLightboxMediaViewer();
    console.log(
      "SOS Infocity Gallery Module: Operational Node Architecture Active.",
    );
  };

  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    bootGallerySystems();
  } else {
    document.addEventListener("DOMContentLoaded", bootGallerySystems);
  }
})();
