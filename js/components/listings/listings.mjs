import { fetchLatestListings } from "/js/api/auction-listings.mjs";
import {
  renderListingCards,
  showLoadingState,
  showErrorState,
} from "/js/components/render/render-listing-cards.mjs";
import { setupSearch } from "/js/components/search/search.mjs";

/**
 * Initializes the listings page functionality
 */
export async function initListingsPage() {
  const containerSelector = "#postsList";
  const loadingSelector = "#display-container";

  // Check if required elements exist
  if (!document.querySelector(containerSelector)) {
    console.error("Posts list container not found");
    return;
  }

  try {
    showLoadingState(containerSelector, loadingSelector);

    // Fetch from API
    console.log("Fetching auction listings for display...");
    const response = await fetchLatestListings(12, 1, { active: true });
    console.log("Fetched latest listings:", response);

    renderListingCards(response.data, containerSelector, loadingSelector);
  } catch (error) {
    console.error("Error loading latest listings:", error);
    showErrorState(error, containerSelector, loadingSelector);
  }
}

/**
 * Sets up all listings page functionality
 */
export function setupListingsPage() {
  // Initialize listings display
  initListingsPage();

  // Setup search functionality
  setupSearch(
    "#site-search",
    'button[class*="Search"]',
    "#postsList",
    "#display-container",
  );
}
