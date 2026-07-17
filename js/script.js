document.addEventListener("DOMContentLoaded", () => {
  const navLinksContainer = document.querySelector(".nav-links");
  if (!navLinksContainer) return;

  const robot = document.createElement("div");
  robot.className = "nav-robot";
  navLinksContainer.appendChild(robot);

  let lastLeftPosition = 0;

  function moveRobotToElement(element) {
    if (!element) return;

    const containerRect = navLinksContainer.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();

    const targetLeft =
      elementRect.left -
      containerRect.left +
      elementRect.width / 2 -
      robot.offsetWidth / 2;

    if (targetLeft < lastLeftPosition) {
      robot.classList.add("facing-left");
    } else if (targetLeft > lastLeftPosition) {
      robot.classList.remove("facing-left");
    }

    robot.classList.remove("jumping");
    void robot.offsetWidth; 
    robot.classList.add("jumping");

    robot.style.left = `${targetLeft}px`;
    lastLeftPosition = targetLeft;
  }

  const activeLink = navLinksContainer.querySelector("a.active");
  if (activeLink) {
    setTimeout(() => moveRobotToElement(activeLink), 100);
  }

  const trackableLinks = navLinksContainer.querySelectorAll("li > a");
  trackableLinks.forEach((link) => {
    link.addEventListener("mouseenter", (e) => moveRobotToElement(e.target));
  });

  navLinksContainer.addEventListener("mouseleave", () => {
    const currentActive = navLinksContainer.querySelector("a.active");
    if (currentActive) moveRobotToElement(currentActive);
  });
});
