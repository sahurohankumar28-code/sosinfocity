const galleryData = {
  departments: {
    title: "Departments & Teams",
    images: [
      
    ]
  },
  training: {
    title: "Training & Development",
    images: [
      "events/photo_5.jpeg",
      "events/photo_1.jpeg",
      "events/photo_2.jpeg",
      "events/photo_3.jpeg",
      "events/photo_18.jpeg",
      "events/photo_16.jpeg",
      "events/photo_6.jpeg",
      "events/photo_7.jpeg"
    ]
  },
  meetings: {
    title: "Meetings & Planning",
    images: [
      "events/photo_21.jpeg",
      "events/photo_22.jpeg",
      "events/photo_23.jpeg"
    ]
  },
  celebration: {
    title: "Celebrations & Festivals",
    images: [

    ]
  },
  awards: {
    title: "Awards & Appreciation",
    images: [
      "events/photo_8.jpeg",
      "events/photo_9.jpeg",
      "events/photo_10.jpeg",
      "events/photo_11.jpeg",
      "events/photo_12.jpeg",
      "events/photo_13.jpeg",
      "events/photo_14.jpeg",
      "events/photo_15.jpeg"
    ]
  }
};

let currentImages = [];
let currentIndex = 0;

function openGallery(category) {
  const data = galleryData[category];
  if (!data) return;

  currentImages = data.images;
  currentIndex = 0;

  document.getElementById("modal-title").innerText = data.title;
  
  // Render Thumbnails
  const thumbContainer = document.getElementById("modal-thumbnails");
  thumbContainer.innerHTML = "";

  currentImages.forEach((imgSrc, idx) => {
    const thumb = document.createElement("img");
    thumb.src = imgSrc;
    thumb.alt = "Thumbnail " + (idx + 1);
    thumb.onclick = () => selectImage(idx);
    thumbContainer.appendChild(thumb);
  });

  updateModalImage();

  const modal = document.getElementById("gallery-modal");
  modal.classList.add("active");
  document.body.style.overflow = "hidden"; 
}

function closeGallery() {
  const modal = document.getElementById("gallery-modal");
  modal.classList.remove("active");
  document.body.style.overflow = "auto";
}

function selectImage(index) {
  currentIndex = index;
  updateModalImage();
}

function changeImage(direction) {
  currentIndex += direction;
  if (currentIndex < 0) {
    currentIndex = currentImages.length - 1;
  } else if (currentIndex >= currentImages.length) {
    currentIndex = 0;
  }
  updateModalImage();
}

function updateModalImage() {
  const activeImg = document.getElementById("modal-active-img");
  activeImg.src = currentImages[currentIndex];

  // Highlight Active Thumbnail
  const thumbs = document.querySelectorAll("#modal-thumbnails img");
  thumbs.forEach((thumb, idx) => {
    if (idx === currentIndex) {
      thumb.classList.add("active-thumb");
      thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    } else {
      thumb.classList.remove("active-thumb");
    }
  });
}

// Close Backdrop & Handle Keyboard Shortcuts
window.onclick = function(e) {
  const modal = document.getElementById("gallery-modal");
  if (e.target === modal) closeGallery();
};

document.addEventListener("keydown", function(e) {
  const modal = document.getElementById("gallery-modal");
  if (modal.classList.contains("active")) {
    if (e.key === "Escape") closeGallery();
    if (e.key === "ArrowLeft") changeImage(-1);
    if (e.key === "ArrowRight") changeImage(1);
  }
});