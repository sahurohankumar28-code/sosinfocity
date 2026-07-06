document.addEventListener("DOMContentLoaded", () => {
  const navLinksContainer = document.querySelector(".nav-links");
  if (!navLinksContainer) return;

  // Create and inject the structural element into the dom dynamically
  const robot = document.createElement("div");
  robot.className = "nav-robot";
  navLinksContainer.appendChild(robot);

  let lastLeftPosition = 0;

  function moveRobotToElement(element) {
    if (!element) return;

    // Calculate layout offsets relative to container box dimensions
    const containerRect = navLinksContainer.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();

    const targetLeft =
      elementRect.left -
      containerRect.left +
      elementRect.width / 2 -
      robot.offsetWidth / 2;

    // Manage travel face direction structures
    if (targetLeft < lastLeftPosition) {
      robot.classList.add("facing-left");
    } else if (targetLeft > lastLeftPosition) {
      robot.classList.remove("facing-left");
    }

    // Trigger dynamic jumping animation classes
    robot.classList.remove("jumping");
    void robot.offsetWidth; // Forces layout recalculation to reset keyframe timelines
    robot.classList.add("jumping");

    // Translate layout coordinates
    robot.style.left = `${targetLeft}px`;
    lastLeftPosition = targetLeft;
  }

  // Set standard anchor point placement targeting your active list item classes
  const activeLink = navLinksContainer.querySelector("a.active");
  if (activeLink) {
    // Short timeout guarantees structural font-faces are fully drawn prior to measurement matches
    setTimeout(() => moveRobotToElement(activeLink), 100);
  }

  // Add optional hover Tracking systems alongside native active state configurations
  const trackableLinks = navLinksContainer.querySelectorAll("li > a");
  trackableLinks.forEach((link) => {
    link.addEventListener("mouseenter", (e) => moveRobotToElement(e.target));
  });

  // Fall back to active configuration targets whenever cursor focus leaves navbar grids
  navLinksContainer.addEventListener("mouseleave", () => {
    const currentActive = navLinksContainer.querySelector("a.active");
    if (currentActive) moveRobotToElement(currentActive);
  });
});
