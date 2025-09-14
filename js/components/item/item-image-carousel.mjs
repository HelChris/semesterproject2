import { showError } from "/js/shared/error-handling.mjs";

export class ItemImageCarousel {
  constructor(mediaArray = []) {
    this.media = this.processMediaArray(mediaArray);
    this.currentIndex = 0;

    this.mainImage = document.getElementById("main-image");
    this.imageCounter = document.getElementById("image-counter");
    this.thumbnailGallery = document.getElementById("thumbnail-gallery");
    this.prevButton = document.getElementById("prev-image");
    this.nextButton = document.getElementById("next-image");

    this.initialize();
  }

  processMediaArray(mediaArray) {
    if (!Array.isArray(mediaArray) || mediaArray.length === 0) {
      return [{ url: "/img/placeholder.jpg", alt: "No image available" }];
    }

    const validMedia = mediaArray.filter((media) => {
      return (
        media &&
        typeof media === "object" &&
        media.url &&
        typeof media.url === "string" &&
        media.url.trim()
      );
    });

    if (validMedia.length === 0) {
      return [{ url: "/img/placeholder.jpg", alt: "No image available" }];
    }

    return validMedia;
  }

  initialize() {
    if (!this.mainImage) {
      showError("Main image element not found", "#image-carousel-message", {
        scrollToTop: false,
      });
      return;
    }

    this.renderMainImage();
    this.renderThumbnails();
    this.updateCounter();
    this.setupEventListeners();
    this.toggleNavigation();
  }

  renderMainImage() {
    if (!this.media || this.media.length === 0) {
      showError("No media available for rendering", "#image-carousel-message", {
        scrollToTop: false,
      });
      return;
    }

    const currentMedia = this.media[this.currentIndex];

    if (!currentMedia || !currentMedia.url) {
      showError("Current media is invalid", "#image-carousel-message", {
        scrollToTop: false,
      });
      return;
    }

    if (this.mainImage) {
      this.mainImage.src = currentMedia.url;
      this.mainImage.alt = currentMedia.alt || `Image ${this.currentIndex + 1}`;

      this.mainImage.onerror = () => {
        showError("Failed to load image", "#image-carousel-message", {
          scrollToTop: false,
        });
        this.mainImage.src = "/img/placeholder.jpg";
      };
    }
  }

  renderThumbnails() {
    if (!this.thumbnailGallery || this.media.length <= 1) return;

    this.thumbnailGallery.innerHTML = "";

    this.media.forEach((media, index) => {
      const thumbnail = document.createElement("button");
      thumbnail.className = `flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
        index === this.currentIndex
          ? "border-forest-green"
          : "border-gray-200 hover:border-gray-400"
      }`;

      thumbnail.innerHTML = `
        <img src="${media.url}"
             alt="${media.alt || `Image ${index + 1}`}"
             class="w-full h-full object-cover"
             onerror="this.src='/img/placeholder.jpg'">
      `;

      thumbnail.addEventListener("click", () => this.goToImage(index));
      this.thumbnailGallery.appendChild(thumbnail);
    });

    this.thumbnailGallery.classList.remove("hidden");
    this.thumbnailGallery.classList.add("flex");
  }

  updateCounter() {
    if (this.imageCounter) {
      this.imageCounter.textContent = `${this.currentIndex + 1} / ${this.media.length}`;
    }
  }

  setupEventListeners() {
    if (this.prevButton) {
      this.prevButton.addEventListener("click", () => this.previousImage());
    }

    if (this.nextButton) {
      this.nextButton.addEventListener("click", () => this.nextImage());
    }

    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        this.previousImage();
      } else if (e.key === "ArrowRight") {
        this.nextImage();
      }
    });
  }

  toggleNavigation() {
    const hasMultipleImages = this.media.length > 1;

    if (this.prevButton) {
      this.prevButton.style.display = hasMultipleImages ? "block" : "none";
    }
    if (this.nextButton) {
      this.nextButton.style.display = hasMultipleImages ? "block" : "none";
    }
  }

  goToImage(index) {
    if (index >= 0 && index < this.media.length) {
      this.currentIndex = index;
      this.renderMainImage();
      this.updateCounter();
      this.updateThumbnailSelection();
    }
  }

  nextImage() {
    const nextIndex = (this.currentIndex + 1) % this.media.length;
    this.goToImage(nextIndex);
  }

  previousImage() {
    const prevIndex =
      (this.currentIndex - 1 + this.media.length) % this.media.length;
    this.goToImage(prevIndex);
  }

  updateThumbnailSelection() {
    if (!this.thumbnailGallery) return;

    const thumbnails = this.thumbnailGallery.querySelectorAll("button");
    thumbnails.forEach((thumb, index) => {
      if (index === this.currentIndex) {
        thumb.classList.remove("border-gray-200");
        thumb.classList.add("border-forest-green");
      } else {
        thumb.classList.remove("border-forest-green");
        thumb.classList.add("border-gray-200");
      }
    });
  }
}
