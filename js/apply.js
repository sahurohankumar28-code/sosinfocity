if (history.scrollRestoration) {
  history.scrollRestoration = "manual";
}
window.addEventListener("beforeunload", () => {
  window.scrollTo(0, 0);
});
window.scrollTo(0, 0);

document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const selectedJob = urlParams.get("job");
  const headerTitleElement = document.getElementById("activeRoleHeader");
  const appliedRoleInput = document.getElementById("appliedRole");

  if (selectedJob && headerTitleElement) {
    headerTitleElement.textContent = decodeURIComponent(selectedJob);
    if (appliedRoleInput) {
      appliedRoleInput.value = decodeURIComponent(selectedJob);
    }
  }

  let currentStepIndex = 0;
  const steps = document.querySelectorAll(".form-step-panel");
  const dots = document.querySelectorAll(".step-dot");
  const applicationForm = document.getElementById("applicationForm");

  // Step Switcher
  function syncWizardView(targetIndex) {
    steps.forEach((panel, idx) =>
      panel.classList.toggle("active", idx === targetIndex)
    );
    dots.forEach((dot, idx) =>
      dot.classList.toggle("active", idx === targetIndex)
    );
    currentStepIndex = targetIndex;
  }

  // Validate step controls before moving next
  function validateCurrentStepInputs() {
    const activePanel = steps[currentStepIndex];
    const fields = activePanel.querySelectorAll(
      "input[required], textarea[required]"
    );
    let isValid = true;

    fields.forEach((input) => {
      if (!input.checkValidity()) {
        input.reportValidity();
        isValid = false;
      }
    });
    return isValid;
  }

  if (applicationForm) {
    applicationForm.addEventListener("click", (e) => {
      if (e.target.classList.contains("next-step-btn")) {
        if (validateCurrentStepInputs()) {
          syncWizardView(currentStepIndex + 1);
        }
      } else if (e.target.classList.contains("prev-step-btn")) {
        syncWizardView(currentStepIndex - 1);
      }
    });

    // Handle Form Submit via AJAX (FormData required for file upload)
    applicationForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (!validateCurrentStepInputs()) {
        return;
      }

      const submitBtn = applicationForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = 'Submitting... <i class="fas fa-spinner fa-spin"></i>';
      submitBtn.disabled = true;

      const formData = new FormData(applicationForm);

      try {
        const response = await fetch("process_application.php", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (response.ok && result.status === "success") {
          alert(result.message);
          applicationForm.reset();
          syncWizardView(0); // Reset back to step 1

          // Reset upload box UI
          const dropZone = document.getElementById("dropZone");
          const fileBadgeRow = document.getElementById("fileBadgeRow");
          if (dropZone && fileBadgeRow) {
            fileBadgeRow.style.display = "none";
            dropZone.style.display = "block";
          }
        } else {
          alert(result.message || "Form submission failed. Please try again.");
        }
      } catch (err) {
        alert("Network error. Make sure you are running on a PHP server (e.g. localhost).");
      } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }
    });
  }

  // Conditional Experience Field Handler
  const experienceRadios = document.querySelectorAll(
    'input[name="hasExperience"]'
  );
  const expTextAreaBlock = document.getElementById("experienceDetailsBlock");
  const expTextarea = document.getElementById("experienceDetails");

  experienceRadios.forEach((radio) => {
    radio.addEventListener("change", (e) => {
      if (e.target.value === "Yes") {
        expTextAreaBlock.classList.add("visible");
        expTextarea.setAttribute("required", "true");
      } else {
        expTextAreaBlock.classList.remove("visible");
        expTextarea.removeAttribute("required");
        expTextarea.value = "";
      }
    });
  });

  // Resume Drag & Drop Asset Handler
  const fileInput = document.getElementById("resumeFile");
  const dropZone = document.getElementById("dropZone");
  const fileBadgeRow = document.getElementById("fileBadgeRow");
  const loadedFileName = document.getElementById("loadedFileName");
  const removeFileAsset = document.getElementById("removeFileAsset");

  if (fileInput && dropZone) {
    fileInput.addEventListener("change", () => {
      if (fileInput.files.length > 0) {
        loadedFileName.textContent = fileInput.files[0].name;
        dropZone.style.display = "none";
        fileBadgeRow.style.display = "flex";
      }
    });

    if (removeFileAsset) {
      removeFileAsset.addEventListener("click", () => {
        fileInput.value = "";
        fileBadgeRow.style.display = "none";
        dropZone.style.display = "block";
      });
    }
  }
});