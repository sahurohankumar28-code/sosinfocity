document.addEventListener("DOMContentLoaded", () => {
  if (history.scrollRestoration) {
    history.scrollRestoration = "manual";
  }
  window.scrollTo(0, 0);

  const loadHeader = fetch("header.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("header-placeholder").innerHTML = data;
    });

  const loadFooter = fetch("footer.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("footer-placeholder").innerHTML = data;
    });

  Promise.all([loadHeader, loadFooter]).then(() => {
    initializeNavigation();
    highlightActiveTab(); 
  });
});

function initializeNavigation() {
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mobileNavOverlay = document.getElementById("mobileNavOverlay");
  const closeMobileBtn = document.getElementById("closeMobileBtn");

  if (mobileMenuBtn && mobileNavOverlay && closeMobileBtn) {
    mobileMenuBtn.addEventListener("click", () => {
      mobileNavOverlay.classList.add("open");
    });

    closeMobileBtn.addEventListener("click", () => {
      mobileNavOverlay.classList.remove("open");
    });

    mobileNavOverlay.addEventListener("click", (e) => {
      if (e.target === mobileNavOverlay) {
        mobileNavOverlay.classList.remove("open");
      }
    });
  }
}

function highlightActiveTab() {
  const currentPath = globalThis.location.pathname.split("/").pop() || "index.html";
  
  const navLinks = document.querySelectorAll(
    ".nav-links a, .mobile-nav-overlay a"
  );

  navLinks.forEach((link) => {
    link.classList.remove("active");
    
    const hrefAttr = link.getAttribute("href");
    if (!hrefAttr) return;

    const linkPath = hrefAttr.replace(/^\.\//, "").split("/").pop();

   
    if (currentPath === linkPath || (currentPath === "index.html" && linkPath === "")) {
      link.classList.add("active");
      
      const dropdownParent = link.closest(".dropdown");
      if (dropdownParent) {
        const parentAnchor = dropdownParent.querySelector("a");
        if (parentAnchor) {
          parentAnchor.classList.add("active");
        }
      }
    }
  });
}


document.addEventListener("DOMContentLoaded", () => {

  const splashScreen = document.getElementById("splash-screen");
  const splashVideo = document.getElementById("splash-video");

  const hideSplash = () => {
    if (splashScreen && !splashScreen.classList.contains("hidden")) {
      splashScreen.classList.add("hidden");
    }
  };

  if (splashVideo) {
    // Hide splash screen when video ends
    splashVideo.addEventListener("ended", hideSplash);

    splashVideo.play().catch(() => {
      setTimeout(hideSplash, 3000);
    });

    setTimeout(hideSplash, 6000);
  } else {
    setTimeout(hideSplash, 2500);
  }

});

