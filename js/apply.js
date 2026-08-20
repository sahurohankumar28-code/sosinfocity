document.addEventListener("DOMContentLoaded", () => {
  // Job profiles data
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
      title: "Network Engineer",
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

  // Populate Header and Hidden input
  if (headerTitleElement) headerTitleElement.textContent = currentProfile.title;
  if (appliedRoleInput) appliedRoleInput.value = currentProfile.title;

  // Render Role Highlights
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
  const dots = document.querySelectorAll(".step-dot-item");
  const progressLineFill = document.getElementById("progressLineFill");
  const applicationForm = document.getElementById("applicationForm");

  function syncWizardView(targetIndex) {
    if (targetIndex < 0 || targetIndex >= steps.length) return;

    steps.forEach((panel, idx) =>
      panel.classList.toggle("active", idx === targetIndex)
    );
    dots.forEach((dot, idx) =>
      dot.classList.toggle("active", idx <= targetIndex)
    );

    if (progressLineFill) {
      const fillPercentage = (targetIndex / (steps.length - 1)) * 100;
      progressLineFill.style.width = `${fillPercentage}%`;
    }

    currentStepIndex = targetIndex;
    const formSection = document.querySelector(".application-form-section");
    if (formSection) {
      window.scrollTo({ top: formSection.offsetTop - 20, behavior: "smooth" });
    }
  }

  function validateCurrentStepInputs() {
    const activePanel = steps[currentStepIndex];
    const fields = activePanel.querySelectorAll(
      "input[required], select[required], textarea[required]"
    );
    let isValid = true;

    for (const input of fields) {
      if (!input.checkValidity()) {
        input.reportValidity();
        isValid = false;
        break;
      }
    }
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

    // Form Submit Handler
    applicationForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (!validateCurrentStepInputs()) {
        return;
      }

      const submitBtn = document.getElementById("submitAppBtn");
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span>Submitting...</span> <i class="fas fa-spinner fa-spin"></i>';
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

          // Reset Upload Badge
          const dropZone = document.getElementById("dropZone");
          const fileBadgeRow = document.getElementById("fileBadgeRow");
          if (dropZone && fileBadgeRow) {
            fileBadgeRow.style.display = "none";
            dropZone.style.display = "block";
          }
        } else {
          alert(result.message || "Submission failed. Please try again.");
        }
      } catch (err) {
        alert("A network error occurred. Please try again.");
      } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }
    });
  }

  // Dynamic Experience Fields Logic
  const experienceRadios = document.querySelectorAll('input[name="hasExperience"]');
  const expBlock = document.getElementById("experienceDetailsBlock");
  const expInputs = expBlock.querySelectorAll("input, select, textarea");

  experienceRadios.forEach((radio) => {
    radio.addEventListener("change", (e) => {
      if (e.target.value === "Yes") {
        expBlock.classList.add("visible");
        // Mark essential experience inputs as required
        document.getElementById("totalExperience").setAttribute("required", "true");
        document.getElementById("noticePeriod").setAttribute("required", "true");
        document.getElementById("currentCompany").setAttribute("required", "true");
        document.getElementById("currentDesignation").setAttribute("required", "true");
        document.getElementById("experienceDetails").setAttribute("required", "true");
      } else {
        expBlock.classList.remove("visible");
        // Remove requirements and clean up values
        expInputs.forEach((input) => {
          input.removeAttribute("required");
          input.value = "";
        });
      }
    });
  });

  // Resume Upload Handler (with Drag & Drop)
  const fileInput = document.getElementById("resumeFile");
  const dropZone = document.getElementById("dropZone");
  const fileBadgeRow = document.getElementById("fileBadgeRow");
  const loadedFileName = document.getElementById("loadedFileName");
  const loadedFileSize = document.getElementById("loadedFileSize");
  const removeFileAsset = document.getElementById("removeFileAsset");

  const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB

  function handleFileUpload(file) {
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      alert("File size exceeds 1 MB. Please upload a smaller file.");
      fileInput.value = "";
      return;
    }

    loadedFileName.textContent = file.name;
    loadedFileSize.textContent = `${(file.size / 1024).toFixed(1)} KB`;
    dropZone.style.display = "none";
    fileBadgeRow.style.display = "flex";
  }

  if (fileInput && dropZone) {
    fileInput.addEventListener("change", () => {
      if (fileInput.files.length > 0) {
        handleFileUpload(fileInput.files[0]);
      }
    });

    ["dragenter", "dragover"].forEach((eventName) => {
      dropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropZone.classList.add("dragover");
      });
    });

    ["dragleave", "drop"].forEach((eventName) => {
      dropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropZone.classList.remove("dragover");
      });
    });

    dropZone.addEventListener("drop", (e) => {
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        fileInput.files = e.dataTransfer.files;
        handleFileUpload(e.dataTransfer.files[0]);
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