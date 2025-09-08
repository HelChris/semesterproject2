import { fetchLatestListings } from "/js/api/auction-listings.mjs";
import {
  renderListingCards,
  showLoadingState,
  showErrorState,
} from "/js/components/render/render-listing-cards.mjs";
import { LoadMoreHandler } from "./load-more-handler.mjs";

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
    showLoadingState(containerSelector, loadingSelector);
    const cachedResults = sessionStorage.getItem("searchResults");

    if (cachedResults) {
      await handleCachedSearchResults(
        cachedResults,
        containerSelector,
        loadingSelector,
        buttonSelector,
      );
    } else {
      await handleNormalListings(
        containerSelector,
        loadingSelector,
        buttonSelector,
      );
    }
  } catch (error) {
    console.error("Error loading listings:", error);
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
    console.warn(
      "Failed to parse cached results, falling back to normal listings:",
      error,
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
