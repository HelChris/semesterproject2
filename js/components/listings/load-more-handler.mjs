import { fetchLatestListings } from "/js/api/auction-listings.mjs";
import { createListingCard } from "/js/components/item-cards/listing-card-component.mjs";

export class LoadMoreHandler {
  constructor(options = {}) {
    this.containerSelector = options.containerSelector || "#postsList";
    this.buttonSelector = options.buttonSelector || "#load-more-button";
    this.itemsPerPage = options.itemsPerPage || 12;

    // State
    this.currentPage = 1;
    this.isLoading = false;
    this.hasMoreItems = true;
    this.isSearchActive = false;
    this.originalButtonText = "Load More";
    this.searchButtonText = "Explore More";

    this.container = null;
    this.button = null;

    this.initialize();
  }

  initialize() {
    this.container = document.querySelector(this.containerSelector);
    this.button = document.querySelector(this.buttonSelector);

    if (!this.container || !this.button) {
      console.warn("LoadMore: Required elements not found");
      return;
    }

    this.setupEventListeners();
    this.updateButton();
  }

  setupEventListeners() {
    // Remove existing listeners
    const newButton = this.button.cloneNode(true);
    this.button.replaceWith(newButton);
    this.button = newButton;

    this.button.addEventListener("click", () => this.loadMore());
  }

  async loadMore() {
    if (this.isLoading) return;

    if (this.isSearchActive) {
      sessionStorage.removeItem("searchQuery");
      sessionStorage.removeItem("searchResults");

      const searchInput = document.querySelector("#site-search");
      if (searchInput) {
        searchInput.value = "";
      }

      window.location.reload();
      return;
    }

    if (!this.hasMoreItems) return;

    try {
      this.setLoadingState(true);

      this.currentPage += 1;
      console.log(`Loading page ${this.currentPage}...`);

      const response = await fetchLatestListings(
        this.itemsPerPage,
        this.currentPage,
        { active: true },
      );

      this.appendItems(response.data);
      this.hasMoreItems = response.data.length === this.itemsPerPage;
    } catch (error) {
      console.error("Error loading more items:", error);
      this.showError("Failed to load more items. Please try again.");
    } finally {
      this.setLoadingState(false);
    }
  }

  appendItems(items) {
    if (!items || items.length === 0) return;

    items.forEach((item) => {
      const card = createListingCard(item);
      this.container.appendChild(card);
    });
  }

  updateButton() {
    if (!this.button) return;

    if (this.isSearchActive) {
      this.button.disabled = false;
      this.button.textContent = this.searchButtonText;
      this.button.style.display = "block";
    } else if (this.isLoading) {
      this.button.disabled = true;
      this.button.textContent = "Loading...";
      this.button.style.display = "block";
    } else if (!this.hasMoreItems) {
      this.button.disabled = true;
      this.button.style.display = "none";
    } else {
      this.button.disabled = false;
      this.button.textContent = this.originalButtonText;
      this.button.style.display = "block";
    }
  }

  setLoadingState(loading) {
    this.isLoading = loading;
    this.updateButton();
  }

  reset() {
    this.currentPage = 1;
    this.isLoading = false;
    this.hasMoreItems = true;
    this.updateButton();
  }

  setSearchActive(isActive) {
    this.isSearchActive = isActive;
    this.updateButton();
  }

  showError(message) {
    alert(message);
  }
}
