document.addEventListener("DOMContentLoaded", () => {
  // 1. Fetch and Load Header
  const loadHeader = fetch("header.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("header-placeholder").innerHTML = data;
    });

  // 2. Fetch and Load Footer
  const loadFooter = fetch("footer.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("footer-placeholder").innerHTML = data;
    });

  // 3. Initialize everything once elements are loaded into the DOM
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
    // Corrected to use 'open' to match style.css
    mobileMenuBtn.addEventListener("click", () => {
      mobileNavOverlay.classList.add("open");
    });

    closeMobileBtn.addEventListener("click", () => {
      mobileNavOverlay.classList.remove("open");
    });

    // Optional: Close menu when clicking on the dark background overlay
    mobileNavOverlay.addEventListener("click", (e) => {
      if (e.target === mobileNavOverlay) {
        mobileNavOverlay.classList.remove("open");
      }
    });
  }
}

function highlightActiveTab() {
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll(
    ".nav-links a, .mobile-nav-overlay a",
  );

  navLinks.forEach((link) => {
    link.classList.remove("active");
    const linkPath = link.getAttribute("href").split("/").pop();

    if (currentPath === linkPath) {
      link.classList.add("active");
      const dropdownParent = link.closest(".dropdown");
      if (dropdownParent) {
        dropdownParent.querySelector("a").classList.add("active");
      }
    }
  });
}