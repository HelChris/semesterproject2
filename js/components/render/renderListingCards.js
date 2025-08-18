import { createListingCard } from "/js/itemCards/listingCardComponent.js";

/**
 * Renders auction listings as cards in the specified container
 * @param {Array} listings - Array of listing objects to render
 * @param {string} containerSelector - CSS selector for the container element
 * @param {string} loadingSelector - CSS selector for loading message container (optional)
 * @returns {void}
 */
export function renderListingCards(
  listings,
  containerSelector,
  loadingSelector = null,
) {
  const container = document.querySelector(containerSelector);

  if (!container) {
    console.error(`Container not found: ${containerSelector}`);
    return;
  }

  // Clear loading message if provided
  if (loadingSelector) {
    const loadingContainer = document.querySelector(loadingSelector);
    if (loadingContainer) {
      loadingContainer.innerHTML = "";
    }
  }

  // Clear existing content
  container.innerHTML = "";

  if (!listings || listings.length === 0) {
    container.innerHTML =
      '<p class="text-center col-span-full text-gray-600">No listings found.</p>';
    return;
  }

  // Create and append listing cards
  listings.forEach((listing) => {
    const card = createListingCard(listing);
    container.appendChild(card);
  });

  console.log(`Rendered ${listings.length} listing cards`);
}

/**
 * Shows loading state in the listings container
 * @param {string} containerSelector - CSS selector for the container element
 * @param {string} loadingSelector - CSS selector for loading message container (optional)
 * @returns {void}
 */
export function showLoadingState(containerSelector, loadingSelector = null) {
  const container = document.querySelector(containerSelector);
  const loadingContainer = loadingSelector
    ? document.querySelector(loadingSelector)
    : container;

  if (loadingContainer) {
    loadingContainer.innerHTML =
      '<p class="text-center">Loading listings...</p>';
  }

  if (container && container !== loadingContainer) {
    container.innerHTML = "";
  }
}

/**
 * Shows error state in the listings container
 * @param {string} error - Error message to display
 * @param {string} containerSelector - CSS selector for the container element
 * @param {string} loadingSelector - CSS selector for loading message container (optional)
 * @returns {void}
 */
export function showErrorState(
  error,
  containerSelector,
  loadingSelector = null,
) {
  const container = document.querySelector(containerSelector);
  const loadingContainer = loadingSelector
    ? document.querySelector(loadingSelector)
    : null;

  // Clear loading message
  if (loadingContainer) {
    loadingContainer.innerHTML = "";
  }

  if (container) {
    const errorMessage = `Failed to load listings: ${error.message || error}`;
    container.innerHTML = `<p class="text-center col-span-full text-red-600">${errorMessage}</p>`;
  }
}
