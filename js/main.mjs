import { setupRegisterForm } from "./utils/registerFormHandler.mjs";
import { loginHandler } from "/js/auth/login.mjs";
import { updateNavigation, setupLogoutListeners } from "/js/auth/logout.mjs";
import { fetchAuctionListings } from "/js/api/auctionListings.mjs";
import { createListingHandler } from "./utils/createListingHandler.mjs";
import { setupContactForm } from "/js/utils/contactFormHandler.mjs";

/**
 * Routes to the appropriate handler based on the current URL path
 *
 * This function determines which page is currently being viewed based on the URL path,
 * sets up common functionality like logout buttons, and initializes the appropriate
 * page-specific handlers and event listeners.
 *
 * @returns {void}
 *
 * @example
 * // Call the router function when the application loads
 * document.addEventListener('DOMContentLoaded', () => {
 *   router();
 *   console.log('Application routing initialized');
 * });
 */
function router() {
  const pathname = window.location.pathname;

  updateNavigation();
  setupLogoutListeners();

  switch (pathname) {
    case "/":
    case "/index.html":
      break;
    case "/pages/login.html":
      loginHandler();
      break;
    case "/pages/register.html":
      setupRegisterForm();
      break;
    case "/pages/listings.html":
    case "/listings/":
      handleListingsPage();
      break;
    case "/pages/createListing.html":
      createListingHandler();
      break;
    case "/pages/item.html":
      break;
    case "/pages/profile.html":
    case "/profile/":
      break;
    case "/pages/editProfile.html":
      break;
    case "/pages/contact.html":
      setupContactForm();
      break;
  }
}

/**
 * Handles the listings page functionality
 */
async function handleListingsPage() {
  const postsListContainer = document.getElementById("postsList");

  if (!postsListContainer) {
    console.error("Posts list container not found");
    return;
  }

  try {
    console.log("Loading listings page...");
    const response = await fetchAuctionListings(12, 1);

    if (response.data && response.data.length > 0) {
      // Import the card component
      const { createListingCard } = await import(
        "/js/components/itemCards/listingCardComponent.mjs"
      );

      // Clear existing content
      postsListContainer.innerHTML = "";

      // Create and append listing cards
      response.data.forEach((listing) => {
        const card = createListingCard(listing);
        postsListContainer.appendChild(card);
      });

      console.log(`Displayed ${response.data.length} listings`);
    } else {
      postsListContainer.innerHTML =
        '<p class="text-center col-span-full">No listings found.</p>';
    }
  } catch (error) {
    console.error("Error loading listings:", error);
    postsListContainer.innerHTML = `<p class="text-center col-span-full text-red-600">Failed to load listings: ${error.message}</p>`;
  }
}

router();
