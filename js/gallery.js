const galleryData = {
  departments: {
    title: "Departments & Teams",
    images: [
      
    ]
  },
  training: {
    title: "Training & Development",
    images: [
      "events/photo_5.webp",
      "events/photo_1.webp",
      "events/photo_2.webp",
      "events/photo_3.webp",
      "events/photo_18.webp",
      "events/photo_16.webp",
      "events/photo_6.webp",
      "events/photo_7.webp"
    ]
  },
  meetings: {
    title: "Meetings & Planning",
    images: [
      "events/photo_21.webp",
      "events/photo_22.webp",
      "events/photo_23.webp"
    ]
  },
  celebration: {
    title: "Celebrations",
    images: [
         "events/photo_24.webp",
         "events/photo_25.webp",
         "events/photo_26.webp",
         "events/photo_27.webp",
         "events/photo_28.webp",
         "events/photo_29.webp",
         "events/photo_30.webp",
         "events/photo_31.webp",
         "events/photo_32.webp",
         "events/photo_33.webp",
         "events/photo_34.webp",
         "events/photo_35.webp",
         "events/photo_36.webp",
         "events/photo_37.webp",
         "events/pic1.webp",
         "events/pic2.webp",
         "events/pic3.webp",
         "events/pic4.webp",
         "events/pic5.webp",
         "events/pic6.webp",
         "events/pic7.webp",
         "events/pic8.webp",
         "events/pic9.webp",
         "events/pic10.webp",
         "events/pic11.webp",
         "events/pic12.webp",
         "events/pic13.webp",
         "events/pic14.webp",
         "events/pic15.webp",
         "events/pic16.webp",
         "events/pic17.webp",
         "events/pic18.webp"
    ]
  },
  awards: {
    title: "Awards & Appreciation",
    images: [
      "events/photo_8.webp",
      "events/photo_9.webp",
      "events/photo_10.webp",
      "events/photo_11.webp",
      "events/photo_12.webp",
      "events/photo_13.webp",
      "events/photo_14.webp",
      "events/photo_15.webp",
      "events/photo_38.webp",
      "events/photo_39.webp",
      "events/photo_40.webp"
    ]
  },
  funGames: {
    title: "Fun & Games",
    images: [
      "events/ff.webp",
      "events/ff1.webp",
      "events/ff2.webp",
      "events/ff3.webp",
      "events/ff4.webp",
      "events/ff5.webp",
      "events/ff6.webp",
      "events/ff7.webp",
      "events/ff8.webp",
      "events/ff9.webp",
      "events/ff10.webp"
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