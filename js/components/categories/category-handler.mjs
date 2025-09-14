/**
 * @fileoverview Category-Based Listing Handler Module
 *
 * This module provides comprehensive category filtering and display functionality
 * for the auction platform's listings page. Handles URL-based category routing,
 * dynamic content loading, pagination, and graceful fallback to general listings.
 *
 * Features:
 * - URL parameter-based category filtering (?category=electronics)
 * - Multi-page data fetching for comprehensive category coverage
 * - Intelligent pagination with load-more functionality
 * - Graceful fallback when no category results are found
 * - Dynamic page title and breadcrumb updates
 * - Mobile and desktop responsive category display
 * - State management for filtered vs. unfiltered views
 * - Loading and error state handling
 *
 * Architecture:
 * - CategoryHandler class manages all category-related state and operations
 * - Integrates with existing listing card components and load-more handlers
 * - Supports both category-filtered and normal listing modes
 * - Handles URL routing and browser navigation
 *
 * Dependencies:
 * - fetchLatestListings: API service for listing data retrieval
 * - CATEGORIES & filterByCategory: Category mapping and filtering utilities
 * - renderListingCards & state utilities: UI rendering and state management
 * - LoadMoreHandler: Pagination functionality for normal listings
 * - createListingCard: Individual listing card component
 *
 * Usage Patterns:
 * - Initialize via initializeCategoryHandler() on page load
 * - Automatic category detection from URL parameters
 * - Fallback to normal listings when category is empty or invalid
 * - Supports direct category URLs like /listings.html?category=electronics
 *
 * State Management:
 * - Maintains separate arrays for all listings vs. filtered listings
 * - Tracks current category, pagination state, and display preferences
 * - Handles loading states and error recovery
 * - Preserves user experience during category transitions
 *
 */
import { fetchLatestListings } from "/js/api/auction-listings.mjs";
import {
  CATEGORIES,
  filterByCategory,
} from "/js/components/categories/category-mapping.mjs";
import {
  renderListingCards,
  showLoadingState,
  showErrorState,
} from "/js/components/render/render-listing-cards.mjs";
import { LoadMoreHandler } from "/js/components/listings/load-more-handler.mjs";
import { createListingCard } from "/js/components/listings/listing-card-component.mjs";

/**
 * Handles category filtering and display for listings page
 */
export class CategoryHandler {
  constructor() {
    this.currentCategory = null;
    this.allListings = [];
    this.filteredListings = [];
    this.containerSelector = "#postsList";
    this.loadingSelector = "#display-container";
    this.buttonSelector = "#load-more-button";
    this.loadMoreHandler = null;

    // Pagination state
    this.currentPage = 1;
    this.itemsPerPage = 12;
    this.displayedItems = 0;
  }

  /**
   * Initialize category handling from URL parameters
   */
  async init() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get("category");

    if (category && CATEGORIES[category]) {
      await this.loadCategoryListings(category);
      this.updatePageTitle(category);
      this.showCategoryBreadcrumb(category);
    } else {
      // Load normal listings (not organized by categories)
      await this.loadNormalListings();
    }
  }

  /**
   * Load and filter listings by specific category
   * @param {string} categoryKey - The category to filter by
   */
  async loadCategoryListings(categoryKey) {
    try {
      showLoadingState(this.containerSelector, this.loadingSelector);

      // Fetch multiple pages to get better category coverage (max 100 per request)
      let allListings = [];
      let currentPage = 1;
      const maxPages = 3; // Fetch up to 3 pages (300 listings total)

      // Fetch multiple pages to get more listings for category filtering
      for (let page = 1; page <= maxPages; page++) {
        try {
          const response = await fetchLatestListings(100, page, {
            active: true,
          });

          if (response.data && response.data.length > 0) {
            allListings = allListings.concat(response.data);
          }

          // If we got less than 100 items, we've reached the end
          if (!response.data || response.data.length < 100) {
            break;
          }
        } catch (error) {
          console.warn(`Failed to fetch page ${page}:`, error);
          break; // Stop fetching more pages if one fails
        }
      }

      this.allListings = allListings;

      // Filter by category using exact matching
      this.filteredListings = filterByCategory(this.allListings, categoryKey);
      this.currentCategory = categoryKey;

      console.log(
        `Category ${categoryKey}: Found ${this.filteredListings.length} listings from ${this.allListings.length} total`,
      );

      if (this.filteredListings.length === 0) {
        this.showNoCategoryResults(categoryKey);
        return;
      }

      // Show first page of filtered listings
      this.currentPage = 1;
      this.displayedItems = 0;
      this.renderPage();

      // Setup load more functionality for filtered results
      this.setupCategoryLoadMore();

      // Update UI to show current category
      this.updateCategoryDisplay(categoryKey, this.filteredListings.length);
    } catch (error) {
      console.error("Error loading category listings:", error);
      showErrorState(error, this.containerSelector, this.loadingSelector);
    }
  }

  /**
   * Render a page of filtered listings
   */
  renderPage() {
    const container = document.querySelector(this.containerSelector);
    const loadingContainer = document.querySelector(this.loadingSelector);

    if (loadingContainer) {
      loadingContainer.innerHTML = "";
    }

    if (!container) return;

    // Calculate items for this page
    const startIndex = this.displayedItems;
    const endIndex = Math.min(
      startIndex + this.itemsPerPage,
      this.filteredListings.length,
    );
    const pageItems = this.filteredListings.slice(startIndex, endIndex);

    if (this.currentPage === 1) {
      // Clear container for first page
      container.innerHTML = "";
    }

    // Render items for this page
    pageItems.forEach((listing) => {
      const card = this.createListingCard(listing);
      container.appendChild(card);
    });

    this.displayedItems = endIndex;
  }

  /**
   * Setup load more functionality for category filtered results
   */
  setupCategoryLoadMore() {
    // Clean up existing load more handler
    if (this.loadMoreHandler) {
      this.loadMoreHandler = null;
    }

    const loadMoreButton = document.querySelector(this.buttonSelector);
    if (!loadMoreButton) return;

    // Update button state
    this.updateLoadMoreButton();

    // Remove existing listeners and add new one
    const newButton = loadMoreButton.cloneNode(true);
    loadMoreButton.replaceWith(newButton);

    newButton.addEventListener("click", () => this.loadMoreCategoryItems());
  }

  /**
   * Load more items from the filtered category results
   */
  loadMoreCategoryItems() {
    if (this.displayedItems >= this.filteredListings.length) return;

    const loadMoreButton = document.querySelector(this.buttonSelector);
    if (loadMoreButton) {
      loadMoreButton.disabled = true;
      loadMoreButton.textContent = "Loading...";
    }

    // Simulate loading delay for better UX
    setTimeout(() => {
      this.currentPage++;
      this.renderPage();
      this.updateLoadMoreButton();
    }, 300);
  }

  /**
   * Update load more button state
   */
  updateLoadMoreButton() {
    const loadMoreButton = document.querySelector(this.buttonSelector);
    if (!loadMoreButton) return;

    const hasMoreItems = this.displayedItems < this.filteredListings.length;

    if (hasMoreItems) {
      loadMoreButton.style.display = "block";
      loadMoreButton.disabled = false;
      loadMoreButton.textContent = "Load More";
    } else {
      loadMoreButton.style.display = "none";
    }
  }

  /**
   * Load normal listings (not organized by categories)
   */
  async loadNormalListings() {
    try {
      showLoadingState(this.containerSelector, this.loadingSelector);

      // Load normal paginated listings
      const response = await fetchLatestListings(12, 1, { active: true });
      this.allListings = response.data;

      // Render normal listings
      renderListingCards(
        response.data,
        this.containerSelector,
        this.loadingSelector,
      );

      // Setup normal load more functionality
      this.setupNormalLoadMore();
    } catch (error) {
      console.error("Error loading normal listings:", error);
      showErrorState(error, this.containerSelector, this.loadingSelector);
    }
  }

  /**
   * Setup normal load more functionality (non-category)
   */
  setupNormalLoadMore() {
    this.loadMoreHandler = new LoadMoreHandler({
      containerSelector: this.containerSelector,
      buttonSelector: this.buttonSelector,
      itemsPerPage: 12,
    });
  }

  /**
   * Show no results message for category and load normal listings
   * @param {string} categoryKey - Category that had no results
   */
  showNoCategoryResults(categoryKey) {
    const container = document.querySelector(this.containerSelector);
    const loadingContainer = document.querySelector(this.loadingSelector);

    if (loadingContainer) {
      loadingContainer.innerHTML = "";
    }

    if (!container) return;

    const categoryName = CATEGORIES[categoryKey]?.name || "This Category";

    // Show no category results message
    const noResultsMessage = document.createElement("div");
    noResultsMessage.className = "col-span-full mb-8";
    noResultsMessage.innerHTML = `
      <div class="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-lg font-medium text-yellow-800">No ${categoryName} Found</h3>
            <p class="text-yellow-700 mt-1">There are currently no active listings in this category. Here are other available listings:</p>
          </div>
        </div>
      </div>
    `;

    container.appendChild(noResultsMessage);

    // Load and show normal listings below the message
    this.loadNormalListingsAfterNoResults(container);
  }

  /**
   * Load normal listings after showing no category results message
   * @param {HTMLElement} container - The container to append listings to
   */
  async loadNormalListingsAfterNoResults(container) {
    try {
      // Fetch normal listings
      const response = await fetchLatestListings(12, 1, { active: true });

      // Add section header for normal listings
      const normalHeader = document.createElement("div");
      normalHeader.className = "col-span-full mb-6 mt-8";
      normalHeader.innerHTML = `
        <div class="flex items-center justify-between p-4 bg-gray-100 rounded-lg border-l-4 border-gray-400">
          <div>
            <h2 class="text-2xl font-bold text-gray-700">All Available Listings</h2>
            <p class="text-gray-600">${response.data.length} active listings shown</p>
          </div>
          <a
            href="/pages/listings.html"
            class="text-sm px-3 py-1 bg-forest-green text-earthy-beige rounded hover:bg-soft-teal-2 transition-colors"
          >
            View All
          </a>
        </div>
      `;
      container.appendChild(normalHeader);

      // Render listings
      response.data.forEach((listing) => {
        const card = this.createListingCard(listing);
        container.appendChild(card);
      });

      // Setup load more for fallback listings
      this.setupNormalLoadMore();
    } catch (error) {
      console.error("Error loading fallback listings:", error);
      const errorDiv = document.createElement("div");
      errorDiv.className = "col-span-full text-center py-8 text-red-600";
      errorDiv.textContent = "Failed to load listings. Please try again later.";
      container.appendChild(errorDiv);
    }
  }

  /**
   * Create a listing card element using the existing component
   * @param {Object} listing - Listing data
   * @returns {HTMLElement} Card element
   */
  createListingCard(listing) {
    // Use the existing listing card component which already has proper layout
    return createListingCard(listing);
  }

  /**
   * Update page title based on category
   * @param {string} categoryKey - The category key
   */
  updatePageTitle(categoryKey) {
    const categoryName = CATEGORIES[categoryKey]?.name || "Category";
    document.title = `${categoryName} - Spirit Bid`;
  }

  /**
   * Show category breadcrumb
   * @param {string} categoryKey - The category key
   */
  showCategoryBreadcrumb(categoryKey) {
    const categoryData = CATEGORIES[categoryKey];
    if (!categoryData) return;

    const container = document.querySelector(this.containerSelector);
    if (!container?.parentNode) return;

    const breadcrumb = document.createElement("div");
    breadcrumb.id = "category-breadcrumb";
    breadcrumb.className =
      "mb-6 p-4 bg-soft-yellow/20 rounded-lg border-l-4 border-forest-green";
    breadcrumb.innerHTML = `
      <div class="flex items-center justify-between flex-wrap gap-2">
        <div class="flex items-center gap-2">
          <a href="/pages/listings.html" class="text-forest-green hover:underline">All Listings</a>
          <span class="text-gray-400">/</span>
          <span class="font-bold text-forest-green">${categoryData.name}</span>
        </div>
        <a
          href="/pages/listings.html"
          class="text-sm px-3 py-1 bg-forest-green text-earthy-beige rounded hover:bg-soft-teal-2 transition-colors"
        >
          View All Listings
        </a>
      </div>
    `;

    container.parentNode.insertBefore(breadcrumb, container);
  }

  /**
   * Update the page display to show current category info
   * @param {string} categoryKey - The category key
   * @param {number} totalCount - Total number of filtered listings
   */
  updateCategoryDisplay(categoryKey, totalCount) {
    const categoryData = CATEGORIES[categoryKey];
    if (!categoryData) return;

    // Update page heading if it exists
    const pageHeading = document.querySelector("h1");
    if (pageHeading) {
      pageHeading.textContent = `${categoryData.name} (${totalCount})`;
    }
  }

  /**
   * Get current filter status
   */
  getCurrentCategory() {
    return this.currentCategory;
  }

  /**
   * Get filtered listings count
   */
  getFilteredCount() {
    return this.filteredListings.length;
  }
}

// Initialize category handler when DOM is loaded
let categoryHandler = null;

/**
 * Initialize category handling for listings page
 */
export function initializeCategoryHandler() {
  if (!categoryHandler) {
    categoryHandler = new CategoryHandler();
  }
  return categoryHandler.init();
}

/**
 * Get the current category handler instance
 */
export function getCategoryHandler() {
  return categoryHandler;
}
