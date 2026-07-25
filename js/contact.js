const contactForm = document.getElementById("contactForm");
const formAlert = document.getElementById("formAlert");

if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const subject = document.getElementById("subject").value.trim();
    const message = document.getElementById("message").value.trim();

    // 1. Validation
    if (!name || !email || !subject || !message) {
      showAlert("Please fill in all fields.", "error");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showAlert("Please enter a valid email address.", "error");
      return;
    }

    // 2. UI Feedback
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = 'Opening Email App... <i class="fas fa-spinner fa-spin"></i>';
    submitBtn.disabled = true;

    // 3. Prepare Mailto Payload
    const recipient = "sahurohankumar7596@gmail.com";
    const emailSubject = encodeURIComponent(`Contact Form: ${subject}`);
    const emailBody = encodeURIComponent(
      `You have received a new contact submission:\n\n` +
      `--------------------------------------------------\n` +
      `Name:    ${name}\n` +
      `Email:   ${email}\n` +
      `Subject: ${subject}\n` +
      `--------------------------------------------------\n\n` +
      `Message:\n${message}\n\n` +
      `--------------------------------------------------`
    );

    // 4. Trigger Email Client & Notify User
    setTimeout(() => {
      window.location.href = `mailto:${recipient}?subject=${emailSubject}&body=${emailBody}`;

      showAlert(
        "Opening your email app! Please click send inside your email application.",
        "success"
      );

      contactForm.reset();
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }, 500);
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