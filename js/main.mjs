import { initializeNavigation } from "./components/nav/nav.mjs";
import { setupRegisterForm } from "/js/utils/register-form-handler.mjs";
import { loginHandler } from "/js/auth/login.mjs";
import { setupLogoutListeners } from "/js/auth/logout.mjs";
import { setupListingsPage } from "/js/components/listings/listings.mjs";
import { createListingHandler } from "/js/utils/create-listing-handler.mjs";
import { setupContactForm } from "/js/utils/contact-form-handler.mjs";
import { setupCreateListingModal } from "/js/components/listings/setup-create-listing-modal.mjs";
import { setupChangePhotoModal } from "/js/utils/setup-change-photo-modal.mjs";
import { loadUserProfile } from "/js/components/user-profile/load-user-profile.mjs";
import { setupEditProfileForm } from "/js/components/edit-profile/setup-edit-profile-form.mjs";
import { setupGlobalSearch } from "./components/search/search-handler.mjs";
import { setupItemPage } from "/js/components/item/item-page-controller.mjs";
import { initializeProfileListingsSorter } from "/js/components/user-profile/user-profile-listings-sorting.mjs";
import { initializeEditListingModal } from "/js/components/user-profile/edit-listing.mjs";
import { checkAuthAndRender } from "/js/utils/route-guard.mjs";

/**
 * Routes to the appropriate handler based on the current URL path
 *
 * This function determines which page is currently being viewed based on the URL path,
 * sets up common functionality like logout buttons, and initializes the appropriate
 * page-specific handlers and event listeners.
 *
 * @returns {void}
 */

let routerInitialized = false;

// Route handlers
function handleIndexPage() {}

function handleLoginPage() {
  loginHandler();
}

function handleRegisterPage() {
  setupRegisterForm();
}

function handleListingsPageRoute() {
  setupListingsPage();
  setupCreateListingModal();
  createListingHandler();
}

function handleCreateListingPage() {
  checkAuthAndRender(
    () => {
      createListingHandler();
    },
    {
      redirectMessage:
        "You need to be logged in to create listings. Join our community to start selling!",
      containerSelector: "main",
    },
  );
}

function handleItemPage() {
  setupItemPage();
}

function handleProfilePage() {
  checkAuthAndRender(
    () => {
      loadUserProfile();
      initializeProfileListingsSorter();
      initializeEditListingModal();
      setupCreateListingModal();
      createListingHandler();
    },
    {
      redirectMessage:
        "You need to be logged in to access your profile. Please sign in to continue.",
      containerSelector: "main",
    },
  );
}

function handleEditProfilePage() {
  loadUserProfile();
  setupEditProfileForm();
  setupChangePhotoModal();
}

function handleContactPage() {
  setupContactForm();
}

const routes = {
  // Index routes
  "": handleIndexPage,
  "/": handleIndexPage,
  "/index.html": handleIndexPage,

  // Login routes
  "/pages/login.html": handleLoginPage,
  "/pages/login": handleLoginPage,
  "/login.html": handleLoginPage,

  // Register routes
  "/pages/register.html": handleRegisterPage,
  "/pages/register": handleRegisterPage,
  "/register.html": handleRegisterPage,

  // Listings routes
  "/pages/listings.html": handleListingsPageRoute,
  "/listings": handleListingsPageRoute,
  "/pages/listings": handleListingsPageRoute,
  "/listings.html": handleListingsPageRoute,

  // Create listing routes
  "/pages/create-listing.html": handleCreateListingPage,
  "/pages/create-listing": handleCreateListingPage,
  "/create-listing.html": handleCreateListingPage,

  // Item routes
  "/pages/item.html": handleItemPage,
  "/pages/item": handleItemPage,
  "/item.html": handleItemPage,

  // Profile routes
  "/pages/profile.html": handleProfilePage,
  "/pages/profile": handleProfilePage,
  "/profile/": handleProfilePage,
  "/profile.html": handleProfilePage,

  // Edit profile routes
  "/pages/edit-profile.html": handleEditProfilePage,
  "/pages/edit-profile": handleEditProfilePage,
  "/edit-profile.html": handleEditProfilePage,

  // Contact routes
  "/pages/contact.html": handleContactPage,
  "/pages/contact": handleContactPage,
  "/contact.html": handleContactPage,
};

function router() {
  const pathname = window.location.pathname;
  clearSearchOnNavigation(pathname);

  // Setup common functionality for all pages
  initializeNavigation();
  setupLogoutListeners();
  setupGlobalSearch();

  // Execute route handler
  const handler = routes[pathname];
  if (handler) {
    handler();
  }
}

function clearSearchOnNavigation(pathname) {
  const isListingsPage = pathname.includes("listings");

  if (!isListingsPage) {
    sessionStorage.removeItem("searchQuery");
    sessionStorage.removeItem("searchResults");

    // Clear search input
    const searchInput = document.querySelector("#site-search");
    if (searchInput) {
      searchInput.value = "";
    }
  }
}

function initializeRouter() {
  if (routerInitialized) {
    return;
  }
  routerInitialized = true;
  router();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeRouter);
} else {
  initializeRouter();
}
