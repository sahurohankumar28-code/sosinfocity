const contactForm = document.getElementById("contactForm");
const formAlert = document.getElementById("formAlert");

if (contactForm) {
  contactForm.addEventListener("submit", async function (e) {
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

    try {
      const response = await fetch("mailer.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, subject, message }),
      });

      const result = await response.json();

      if (response.ok && result.status === "success") {
        showAlert(result.message, "success");
        contactForm.reset();
      } else {
        showAlert(
          result.message || "An error occurred while sending. Please try again.",
          "error"
        );
      }
    } catch (error) {
      showAlert(
        "Network error. Please check your connection and try again.",
        "error"
      );
    } finally {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  });
}

function showAlert(message, type) {
  if (!formAlert) return;
  formAlert.textContent = message;
  formAlert.className = `alert-message alert-${
    type === "success" ? "success" : "error"
  }`;
  formAlert.style.display = "block";

  setTimeout(() => {
    formAlert.style.display = "none";
  }, 6000);
}