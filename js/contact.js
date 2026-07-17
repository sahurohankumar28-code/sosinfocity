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

const contactForm = document.getElementById("contactForm");
const formAlert = document.getElementById("formAlert");

if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const subject = document.getElementById("subject").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !subject || !message) {
      showAlert("Please fill in all fields.", "error");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showAlert("Please enter a valid email address.", "error");
      return;
    }

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
    submitBtn.disabled = true;

    setTimeout(() => {
      const submissions = JSON.parse(
        localStorage.getItem("contact_submissions") || "[]",
      );
      submissions.push({
        name,
        email,
        subject,
        message,
        date: new Date().toISOString(),
      });
      localStorage.setItem("contact_submissions", JSON.stringify(submissions));

      showAlert(
        "Thank you! Your message has been sent successfully. Our team will get back to you within 24 hours.",
        "success",
      );
      contactForm.reset();

      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }, 1500);
  });
}

function showAlert(message, type) {
  if (!formAlert) return;
  formAlert.textContent = message;
  formAlert.className = `alert-message alert-${type === "success" ? "success" : "error"}`;
  formAlert.style.display = "block";

  setTimeout(() => {
    formAlert.style.display = "none";
  }, 5000);
}

document.querySelectorAll(".nav-links a").forEach((link) => {
  if (link.textContent.trim() === "Contact") {
    link.style.color = "var(--primary-light)";
  }
});
