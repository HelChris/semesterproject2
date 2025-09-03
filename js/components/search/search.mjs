import { searchAuctionListings } from "/js/api/auction-listings.mjs";
import {
  renderListingCards,
  showLoadingState,
  showErrorState,
} from "/js/components/render/render-listing-cards.mjs";


/**
 * Sets up search functionality for the search input and button
 * @param {string} searchInputSelector - CSS selector for search input
 * @param {string} searchButtonSelector - CSS selector for search button
 * @param {string} resultsContainerSelector - CSS selector for results container
 * @param {string} loadingContainerSelector - CSS selector for loading container (optional)
 * @returns {void}
 */
export function setupSearch(
  searchInputSelector = "#site-search",
  searchButtonSelector = 'button[class*="Search"]',
  resultsContainerSelector = "#postsList",
  loadingContainerSelector = "#display-container",
) {
  const searchInput = document.querySelector(searchInputSelector);
  const searchButton = document.querySelector(searchButtonSelector);

  if (!searchInput || !searchButton) {
    console.warn("Search elements not found");
    return;
  }

  // Search button click handler
  searchButton.addEventListener("click", async () => {
    const query = searchInput.value.trim();
    if (query) {
      await performSearch(
        query,
        resultsContainerSelector,
        loadingContainerSelector,
      );
    }
  });

  // Enter key handler for search input
  searchInput.addEventListener("keypress", async (e) => {
    if (e.key === "Enter") {
      const query = searchInput.value.trim();
      if (query) {
        await performSearch(
          query,
          resultsContainerSelector,
          loadingContainerSelector,
        );
      }
    }
  });
}

/**
 * Performs the actual search and renders results
 * @param {string} query - Search query
 * @param {string} resultsContainerSelector - CSS selector for results container
 * @param {string} loadingContainerSelector - CSS selector for loading container
 * @returns {Promise<void>}
 */
async function performSearch(
  query,
  resultsContainerSelector,
  loadingContainerSelector,
) {
  try {
    console.log(`Searching for: "${query}"`);

    showLoadingState(resultsContainerSelector, loadingContainerSelector);

    // Perform search
    const response = await searchAuctionListings(query, 12, 1);

    // Render results
    renderListingCards(
      response.data,
      resultsContainerSelector,
      loadingContainerSelector,
    );

    console.log(
      `Search completed: ${response.data?.length || 0} results found`,
    );
  } catch (error) {
    console.error("Search failed:", error);
    showErrorState(error, resultsContainerSelector, loadingContainerSelector);
  }
}

/**
 * Clears search results and shows all listings
 * @param {string} resultsContainerSelector - CSS selector for results container
 * @param {string} loadingContainerSelector - CSS selector for loading container
 * @returns {Promise<void>}
 */
export async function clearSearch(
  resultsContainerSelector,
  loadingContainerSelector,
) {
  try {
    // Import here to avoid circular dependencies
    const { fetchAuctionListings } = await import("/js/api/auctionListings.js");

    showLoadingState(resultsContainerSelector, loadingContainerSelector);
    const response = await fetchAuctionListings(12, 1);
    renderListingCards(
      response.data,
      resultsContainerSelector,
      loadingContainerSelector,
    );
  } catch (error) {
    console.error("Failed to load listings:", error);
    showErrorState(error, resultsContainerSelector, loadingContainerSelector);
  }
}

