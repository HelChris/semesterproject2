import {
  fetchListingsByUser,
  fetchUserBids,
  fetchUserWins,
} from "/js/api/auction-listings.mjs";
import {
  showLoadingState,
  showErrorState,
} from "/js/components/render/render-listing-cards.mjs";
import { showError } from "/js/shared/error-handling.mjs";
import { createUserBidCard } from "/js/components/user-profile/user-bid-card-component.mjs";
import { createUserWinCard } from "/js/components/user-profile/user-win-card-component.mjs";
import { createUserListingCard } from "/js/components/user-profile/user-listing-card-component.mjs";
import { getFromLocalStorage } from "/js/utils/local-storage.mjs";
import { showError } from "../../shared/error-handling.mjs";

export class ProfileListingsSorter {
  constructor() {
    this.currentFilter = "bids";
    this.currentUser = getFromLocalStorage("username");
    this.containerSelector = "#postsList";
    this.loadingSelector = "#display-container";

    this.currentPage = 1;
    this.hasMorePages = false;
    this.isLoading = false;

    this.initialize();
  }

  initialize() {
    this.setupEventListeners();
    this.loadBids(); // Default view
  }
  setupEventListeners() {
    const filterButtons = document.querySelectorAll(".filter-btn");

    filterButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const filter = e.target.dataset.filter;
        this.switchFilter(filter);
      });
    });
    const loadMoreBtn = document.getElementById("load-more-btn");
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener("click", () => {
        this.loadMore();
      });
    }
  }
  switchFilter(filter) {
    if (this.currentFilter === filter) return;

    this.updateActiveButton(filter);
    this.currentFilter = filter;
    this.currentPage = 1;
    this.hasMorePages = false;

    switch (filter) {
      case "bids":
        this.loadBids();
        break;
      case "listings":
        this.loadListings();
        break;
      case "wins":
        this.loadWins();
        break;
    }
  }
  updateActiveButton(activeFilter) {
    const buttons = document.querySelectorAll(".filter-btn");

    buttons.forEach((button) => {
      if (button.dataset.filter === activeFilter) {
        button.className =
          "filter-btn bg-forest-green p-3 w-1/3 text-center text-white active";
      } else {
        button.className =
          "filter-btn p-3 w-1/3 text-center text-black bg-soft-teal-1/50";
      }
    });
  }
  async loadBids() {
    try {
      showLoadingState(this.containerSelector, this.loadingSelector);

      const response = await fetchUserBids(this.currentUser, 12, 1);

      this.hasMorePages = response.meta
        ? response.meta.currentPage < response.meta.pageCount
        : response.data && response.data.length >= 12;
      this.currentPage = 1;

      this.renderBids(response.data);
      this.updateLoadMoreButton();
    } catch (error) {
      showError("Error loading bids: " + error.message, this.containerSelector);
      showErrorState(
        error.message,
        this.containerSelector,
        this.loadingSelector,
      );
      this.hideLoadMoreButton();
    }
  }

  async loadListings() {
    try {
      showLoadingState(this.containerSelector, this.loadingSelector);

      const response = await fetchListingsByUser(this.currentUser, 12, 1);

      this.hasMorePages = response.meta
        ? response.meta.currentPage < response.meta.pageCount
        : response.data && response.data.length >= 12;
      this.currentPage = 1;

      this.renderUserListings(response.data);
      this.updateLoadMoreButton();
    } catch (error) {
      showError(
        "Error loading listings: " + error.message,
        this.containerSelector,
      );
      showErrorState(
        error.message,
        this.containerSelector,
        this.loadingSelector,
      );
      this.hideLoadMoreButton();
    }
  }

  async loadWins() {
    try {
      showLoadingState(this.containerSelector, this.loadingSelector);

      const response = await fetchUserWins(this.currentUser, 12, 1);
      this.hasMorePages = response.meta
        ? response.meta.currentPage < response.meta.pageCount
        : response.data && response.data.length >= 12;
      this.currentPage = 1;

      this.renderWins(response.data);
      this.updateLoadMoreButton();
    } catch (error) {
      showError("Error loading wins: " + error.message, this.containerSelector);
      showErrorState(
        error.message,
        this.containerSelector,
        this.loadingSelector,
      );
      this.hideLoadMoreButton();
    }
  }
  updateLoadMoreButton() {
    const loadMoreBtn = document.getElementById("load-more-btn");

    if (loadMoreBtn) {
      if (this.hasMorePages && !this.isLoading) {
        loadMoreBtn.style.display = "block";
        loadMoreBtn.disabled = false;
        loadMoreBtn.textContent = "Load More";
      } else {
        loadMoreBtn.style.display = "none";
      }
    }
  }
  hideLoadMoreButton() {
    const loadMoreBtn = document.getElementById("load-more-btn");
    if (loadMoreBtn) {
      loadMoreBtn.style.display = "none";
    }
  }

  async loadMore() {
    if (this.isLoading || !this.hasMorePages) return;

    this.isLoading = true;
    const loadMoreBtn = document.getElementById("load-more-btn");

    if (loadMoreBtn) {
      loadMoreBtn.disabled = true;
      loadMoreBtn.textContent = "Loading...";
    }

    try {
      const nextPage = this.currentPage + 1;
      let response;

      switch (this.currentFilter) {
        case "bids":
          response = await fetchUserBids(this.currentUser, 12, nextPage);
          this.appendBids(response.data);
          break;
        case "listings":
          response = await fetchListingsByUser(this.currentUser, 12, nextPage);
          this.appendUserListings(response.data);
          break;
        case "wins":
          response = await fetchUserWins(this.currentUser, 12, nextPage);
          this.appendWins(response.data);
          break;
      }

      this.currentPage = nextPage;

      this.hasMorePages = response.meta
        ? response.meta.currentPage < response.meta.pageCount
        : response.data && response.data.length >= 12;

      this.updateLoadMoreButton();
    } catch (error) {
      showError(
        "Failed to load more items. Please try again.",
        this.containerSelector,
      );
    } finally {
      this.isLoading = false;

      const loadMoreBtn = document.getElementById("load-more-btn");
      if (loadMoreBtn && this.hasMorePages) {
        loadMoreBtn.disabled = false;
        loadMoreBtn.textContent = "Load More";
      }
    }
  }

  appendBids(bids) {
    const container = document.querySelector(this.containerSelector);
    if (!container || !bids?.length) return;

    bids.forEach((bid) => {
      const bidCard = createUserBidCard(bid);
      container.appendChild(bidCard);
    });
  }

  appendUserListings(listings) {
    const container = document.querySelector(this.containerSelector);
    if (!container || !listings?.length) return;

    listings.forEach((listing) => {
      const listingCard = createUserListingCard(listing);
      container.appendChild(listingCard);
    });
  }

  appendWins(wins) {
    const container = document.querySelector(this.containerSelector);
    if (!container || !wins?.length) return;

    wins.forEach((win) => {
      const winCard = createUserWinCard(win);
      container.appendChild(winCard);
    });
  }

  renderBids(bids) {
    const container = document.querySelector(this.containerSelector);
    const loadingContainer = document.querySelector(this.loadingSelector);

    if (loadingContainer) {
      loadingContainer.innerHTML = "";
    }

    if (!container) return;

    container.innerHTML = "";

    if (!bids || bids.length === 0) {
      container.innerHTML =
        '<p class="text-center col-span-full text-gray-600">No active bids found.</p>';
      this.hideLoadMoreButton();
      return;
    }

    bids.forEach((bid) => {
      const bidCard = createUserBidCard(bid);
      container.appendChild(bidCard);
    });
  }

  renderUserListings(listings) {
    const container = document.querySelector(this.containerSelector);
    const loadingContainer = document.querySelector(this.loadingSelector);

    if (loadingContainer) {
      loadingContainer.innerHTML = "";
    }

    if (!container) return;

    container.innerHTML = "";

    if (!listings || listings.length === 0) {
      container.innerHTML =
        '<p class="text-center col-span-full text-gray-600">No listings found.</p>';
      this.hideLoadMoreButton();
      return;
    }

    listings.forEach((listing) => {
      const listingCard = createUserListingCard(listing);
      container.appendChild(listingCard);
    });
  }

  renderWins(wins) {
    const container = document.querySelector(this.containerSelector);
    const loadingContainer = document.querySelector(this.loadingSelector);

    if (loadingContainer) {
      loadingContainer.innerHTML = "";
    }

    if (!container) return;

    container.innerHTML = "";

    if (!wins || wins.length === 0) {
      container.innerHTML =
        '<p class="text-center col-span-full text-gray-600">No wins found yet.</p>';
      this.hideLoadMoreButton();
      return;
    }

    wins.forEach((win) => {
      const winCard = createUserWinCard(win);
      container.appendChild(winCard);
    });
  }
}

export function initializeProfileListingsSorter() {
  return new ProfileListingsSorter();
}
