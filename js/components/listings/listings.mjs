import { fetchAuctionListings } from "/js/api/auctionListings.mjs";
import {
  renderListingCards,
  showLoadingState,
  showErrorState,
} from "/js/components/render/renderListingCards.mjs";
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
    // Show loading state
    showLoadingState(containerSelector, loadingSelector);

    // Fetch listings from API
    console.log("Fetching auction listings for display...");
    const response = await fetchAuctionListings(12, 1);
    console.log("Fetched listings:", response);

    // Render the listings
    renderListingCards(response.data, containerSelector, loadingSelector);
  } catch (error) {
    console.error("Error loading listings:", error);
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

  console.log("Listings page setup complete");
}
