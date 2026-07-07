if (history.scrollRestoration) {
  history.scrollRestoration = "manual";
}
window.addEventListener("beforeunload", () => {
  window.scrollTo(0, 0);
});
window.scrollTo(0, 0);

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

const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach((item) => {
  const question = item.querySelector(".faq-question");

  question.addEventListener("click", () => {
    faqItems.forEach((otherItem) => {
      if (otherItem !== item && otherItem.classList.contains("active")) {
        otherItem.classList.remove("active");
      }
    });
    item.classList.toggle("active");
  });
});

const catBtns = document.querySelectorAll(".faq-cat-btn");
const allFaqItems = document.querySelectorAll(".faq-item");

catBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    catBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const category = btn.dataset.category;

    allFaqItems.forEach((item) => {
      if (
        category === "all" ||
        item.dataset.category === category
      ) {
        item.style.display = "block";
      } else {
        item.style.display = "none";
      }
    });

    allFaqItems.forEach((item) => {
      item.classList.remove("active");
    });
  });
});

document.querySelectorAll(".nav-links a").forEach((link) => {
  if (link.textContent.trim() === "FAQ") {
    link.style.color = "var(--primary-light)";
  }
});
