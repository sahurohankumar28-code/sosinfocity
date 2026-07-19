document.addEventListener("DOMContentLoaded", () => {
  // Set scroll restoration to manual
  if (history.scrollRestoration) {
    history.scrollRestoration = "manual";
  }
  // On page load, scroll to the top
  window.scrollTo(0, 0);

  // 1. Fetch Header and Footer asynchronously
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

  // 2. Wait until both are inserted into DOM, then execute navigation functions
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
  // Get current file name (e.g., 'about.html'). Fallback to 'index.html' if empty string at root '/'
  const currentPath = globalThis.location.pathname.split("/").pop() || "index.html";
  
  const navLinks = document.querySelectorAll(
    ".nav-links a, .mobile-nav-overlay a"
  );

  navLinks.forEach((link) => {
    // Clear any existing active class first
    link.classList.remove("active");
    
    const hrefAttr = link.getAttribute("href");
    if (!hrefAttr) return;

    // Normalize href (strips out leading './' if present)
    const linkPath = hrefAttr.replace(/^\.\//, "").split("/").pop();

    // Check if current file matches link's destination
    if (currentPath === linkPath || (currentPath === "index.html" && linkPath === "")) {
      link.classList.add("active");
      
      // If the link is inside a solutions dropdown, highlight the parent link too
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