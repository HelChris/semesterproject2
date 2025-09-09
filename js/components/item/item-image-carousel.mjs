export class ItemImageCarousel {
  constructor(mediaArray = []) {
    console.log("ItemImageCarousel received media:", mediaArray);

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
      console.log("No media provided, using placeholder");
      return [
        { url: "/public/img/placeholder.jpg", alt: "No image available" },
      ];
    }

    const validMedia = mediaArray.filter((media) => {
      return (
        media &&
        typeof media === "object" &&
        media.url &&
        media.url !== "string" &&
        media.url.trim()
      );
    });

    console.log("Valid media after filtering:", validMedia);

    if (validMedia.length === 0) {
      console.log("No valid media URLs found, using placeholder");
      return [
        { url: "/assets/img/placeholder.jpg", alt: "No image available" },
      ];
    }

    return validMedia;
  }

  initialize() {
    if (!this.mainImage) {
      console.warn("Main image element not found");
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
      console.error("No media available for rendering");
      return;
    }

    const currentMedia = this.media[this.currentIndex];

    if (!currentMedia || !currentMedia.url) {
      console.error("Current media is invalid:", currentMedia);
      return;
    }

    if (this.mainImage) {
      this.mainImage.src = currentMedia.url;
      this.mainImage.alt = currentMedia.alt || `Image ${this.currentIndex + 1}`;

      this.mainImage.onerror = () => {
        console.warn("Failed to load image:", currentMedia.url);
        this.mainImage.src = "/assets/img/placeholder.jpg";
      };
    }

    console.log(`Rendered image ${this.currentIndex + 1}:`, currentMedia.url);
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
             onerror="this.src='/public/img/placeholder.jpg'">
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
