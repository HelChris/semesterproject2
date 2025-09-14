import { fetchLatestListings } from "/js/api/auction-listings.mjs";
import {
  renderListingCards,
  showLoadingState,
  showErrorState,
} from "/js/components/render/render-listing-cards.mjs";
import { LoadMoreHandler } from "./load-more-handler.mjs";
import { initializeCategoryHandler } from "/js/components/categories/category-handler.mjs";
import { showError } from "../../shared/error-handling.mjs";

let loadMoreHandler = null;

export async function initListingsPage(options = {}) {
  const containerSelector = options.containerSelector || "#postsList";
  const loadingSelector = options.loadingSelector || "#display-container";
  const buttonSelector = options.buttonSelector || "#load-more-button";

  if (!document.querySelector(containerSelector)) {
    console.error("Posts list container not found");
    return;
  }

  try {
    // Check if we have a category parameter first
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get("category");

    if (category) {
      // Handle category filtering - category handler manages its own loading state
      await initializeCategoryHandler();
      return; // Exit early, category handler takes over
    }

    // For non-category pages, show loading state
    showLoadingState(containerSelector, loadingSelector);

    // Check for cached search results
    const cachedResults = sessionStorage.getItem("searchResults");

    if (cachedResults) {
      await handleCachedSearchResults(
        cachedResults,
        containerSelector,
        loadingSelector,
        buttonSelector,
      );
    } else {
      // Check if we want organized view (all listings by categories) or normal listings
      const showOrganized = options.organizeByCategories || false;

      if (showOrganized) {
        // Load all listings organized by categories
        await initializeCategoryHandler();
      } else {
        // Load normal paginated listings
        await handleNormalListings(
          containerSelector,
          loadingSelector,
          buttonSelector,
        );
      }
    }
  } catch (error) {
    showError("Error loading listings:", "#error-container", {
      scrollToTop: false,
    });
    showErrorState(error, containerSelector, loadingSelector);
  }
}

async function handleCachedSearchResults(
  cachedResults,
  containerSelector,
  loadingSelector,
  buttonSelector,
) {
  try {
    const response = JSON.parse(cachedResults);
    const query = sessionStorage.getItem("searchQuery");

    renderListingCards(response.data, containerSelector, loadingSelector);

    const searchInput = document.querySelector("#site-search");
    if (searchInput && query) {
      searchInput.value = query;
    }

    loadMoreHandler = new LoadMoreHandler({
      containerSelector,
      buttonSelector,
      itemsPerPage: 12,
    });
    loadMoreHandler.setSearchActive(true);
    sessionStorage.removeItem("searchResults");
  } catch (error) {
    showError(
      "Failed to parse cached results, falling back to normal listings:",
      error,
      "#error-container",
      { scrollToTop: false },
    );

    sessionStorage.removeItem("searchResults");
    sessionStorage.removeItem("searchQuery");

    await handleNormalListings(
      containerSelector,
      loadingSelector,
      buttonSelector,
    );
  }
}

async function handleNormalListings(
  containerSelector,
  loadingSelector,
  buttonSelector,
) {
  const response = await fetchLatestListings(12, 1, { active: true });
  renderListingCards(response.data, containerSelector, loadingSelector);

  const searchInput = document.querySelector("#site-search");
  if (searchInput) {
    searchInput.value = "";
  }

  sessionStorage.removeItem("searchQuery");

  loadMoreHandler = new LoadMoreHandler({
    containerSelector,
    buttonSelector,
    itemsPerPage: 12,
  });
}

export function setupListingsPage(options = {}) {
  initListingsPage(options);
}

export function getLoadMoreHandler() {
  return loadMoreHandler;
}

export function resetPagination() {
  if (loadMoreHandler) {
    loadMoreHandler.reset();
  }
}
