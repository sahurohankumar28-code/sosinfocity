document.addEventListener("DOMContentLoaded", function () {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll(
    ".nav-links a, .mobile-nav-overlay a",
  );

  navLinks.forEach((link) => {
    const linkHref = link.getAttribute("href");
    if (linkHref && currentPath.endsWith(linkHref)) {
      link.classList.add("active");
    } else if (
      (currentPath === "/" || currentPath.endsWith("index.html")) &&
      linkHref === "./index.html"
    ) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
});
