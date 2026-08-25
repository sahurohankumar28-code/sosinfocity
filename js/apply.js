if (history.scrollRestoration) {
  history.scrollRestoration = "manual";
}
window.addEventListener("beforeunload", () => {
  window.scrollTo(0, 0);
});
window.scrollTo(0, 0);

document.addEventListener("DOMContentLoaded", () => {
  // Job descriptions database for dynamic brief points
  const jobProfiles = {
    "Field Engineer": {
      title: "Field Engineer",
      points: [
        "Responsible for on-site installation, commissioning, cabling, and deployment of telecom & networking hardware.",
        "Perform field troubleshooting, optical fiber testing, signal diagnostics, and equipment maintenance.",
        "Collaborate with project managers and site supervisors to ensure zero-downtime execution.",
        "Willingness for site travel across project locations in Odisha and adjacent operational hubs."
      ]
    },
    "Network Engineer": {
      title: "Network & SD-WAN Engineer",
      points: [
        "Configure, monitor, and optimize SD-WAN overlays, enterprise routers, switches, and next-gen firewalls.",
        "Manage site-to-site VPNs, QoS traffic routing policies, bandwidth utilization, and network security protocols.",
        "Diagnose and resolve Layer 2 / Layer 3 connectivity incidents, routing protocols (BGP/OSPF), and packet drops.",
        "Maintain high availability and uptime SLAs across distributed enterprise clients and data center links."
      ]
    },
    "Software Engineer": {
      title: "Software Engineer",
      points: [
        "Design, develop, and deploy scalable full-stack web applications, REST APIs, and microservices.",
        "Work with modern frontend and backend technologies (React, JavaScript, Node.js, Spring Boot, or Python).",
        "Integrate relational and NoSQL databases (MySQL, MongoDB) with optimized indexing and data pipelines.",
        "Write clean, modular code, build reusable UI components, and maintain version control via Git."
      ]
    },
    "System Integration Tester": {
      title: "System Integration & QA Tester",
      points: [
        "Conduct functional, regression, API, and end-to-end integration testing for smart city and enterprise solutions.",
        "Verify seamless data flow between edge devices (cameras, IoT sensors, controllers) and central monitoring dashboards.",
        "Identify, log, and track software bugs with detailed reproduction steps and test reports.",
        "Collaborate closely with developers to validate bug fixes and guarantee release quality."
      ]
    }
  };

  const defaultProfile = {
    title: "General Application Pipeline",
    points: [
      "Join the SOS Infocity talent pool across telecom, cloud networking, cyber security, and software development.",
      "Work on state-of-the-art infrastructure projects, smart city command centers, and industrial automation networks.",
      "Benefit from continuous learning, sponsored professional certifications, and direct mentorship.",
      "Open to energetic freshers and experienced candidates (0-3 years) eager to solve engineering challenges."
    ]
  };

  // URL Parameter Handling
  const urlParams = new URLSearchParams(window.location.search);
  const selectedJob = urlParams.get("job");
  const headerTitleElement = document.getElementById("activeRoleHeader");
  const appliedRoleInput = document.getElementById("appliedRole");
  const jobPointsList = document.getElementById("jobPointsList");

  let currentProfile = defaultProfile;

  if (selectedJob) {
    const decodedRole = decodeURIComponent(selectedJob);
    const matchedKey = Object.keys(jobProfiles).find(
      (key) => decodedRole.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(decodedRole.toLowerCase())
    );

    if (matchedKey) {
      currentProfile = jobProfiles[matchedKey];
    } else {
      currentProfile = {
        title: decodedRole,
        points: defaultProfile.points
      };
    }
  }

  // Populate Header and hidden input
  if (headerTitleElement) headerTitleElement.textContent = currentProfile.title;
  if (appliedRoleInput) appliedRoleInput.value = currentProfile.title;

  // Render Brief Points
  if (jobPointsList) {
    jobPointsList.innerHTML = currentProfile.points
      .map(
        (point) => `
        <li>
          <i class="fas fa-check-circle point-icon"></i>
          <span>${point}</span>
        </li>
      `
      )
      .join("");
  }

  // Wizard Step Handling
  let currentStepIndex = 0;
  const steps = document.querySelectorAll(".form-step-panel");
  const dots = document.querySelectorAll(".step-dot");
  const applicationForm = document.getElementById("applicationForm");

  function syncWizardView(targetIndex) {
    if (targetIndex < 0 || targetIndex >= steps.length) return;

    steps.forEach((panel, idx) =>
      panel.classList.toggle("active", idx === targetIndex)
    );
    dots.forEach((dot, idx) =>
      dot.classList.toggle("active", idx === targetIndex)
    );
    currentStepIndex = targetIndex;
    const formSection = document.querySelector(".application-form-section");
    if (formSection) {
      window.scrollTo({ top: formSection.offsetTop - 40, behavior: "smooth" });
    }
  }

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
      const nextBtn = e.target.closest(".next-step-btn");
      const prevBtn = e.target.closest(".prev-step-btn");

      if (nextBtn) {
        if (validateCurrentStepInputs()) {
          syncWizardView(currentStepIndex + 1);
        }
      } else if (prevBtn) {
        syncWizardView(currentStepIndex - 1);
      }
    });

    // Form Submit via PHP Backend
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
        const response = await fetch("submit-application.php", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (response.ok && result.status === "success") {
          alert(result.message || "Application submitted successfully!");
          applicationForm.reset();
          syncWizardView(0);

          // Reset upload UI
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
        alert("An error occurred during submission. Please try again.");
      } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }
    });
  }

  // Experience toggle handler
  const experienceRadios = document.querySelectorAll('input[name="hasExperience"]');
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

  // Resume File Upload handler
  const fileInput = document.getElementById("resumeFile");
  const dropZone = document.getElementById("dropZone");
  const fileBadgeRow = document.getElementById("fileBadgeRow");
  const loadedFileName = document.getElementById("loadedFileName");
  const removeFileAsset = document.getElementById("removeFileAsset");

  const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB

  if (fileInput && dropZone) {
    fileInput.addEventListener("change", () => {
      if (fileInput.files.length > 0) {
        const selectedFile = fileInput.files[0];

        if (selectedFile.size > MAX_FILE_SIZE) {
          alert("File size exceeds 1 MB. Please upload a smaller file.");
          fileInput.value = "";
          return;
        }

        loadedFileName.textContent = selectedFile.name;
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