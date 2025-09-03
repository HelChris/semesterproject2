import { setupRegisterForm } from "/js/utils/register-form-handler.mjs";
import { loginHandler } from "/js/auth/login.mjs";
import { updateNavigation, setupLogoutListeners } from "/js/auth/logout.mjs";
import { setupListingsPage } from "/js/components/listings/listings.mjs";
import { createListingHandler } from "/js/utils/create-listing-handler.mjs";
import { setupContactForm } from "/js/utils/contact-form-handler.mjs";
import { setupCreateListingModal } from "/js/components/listings/setup-create-listing-modal.mjs";
import { setupChangePhotoModal } from "/js/utils/setup-change-photo-modal.mjs";
import { loadUserProfile } from "/js/components/user-profile/load-user-profile.mjs";
import { setupEditProfileForm } from "/js/components/edit-profile/setup-edit-profile-form.mjs";

/**
 * Routes to the appropriate handler based on the current URL path
 *
 * This function determines which page is currently being viewed based on the URL path,
 * sets up common functionality like logout buttons, and initializes the appropriate
 * page-specific handlers and event listeners.
 *
 * @returns {void}
 */

// Environment detection
const isDev = !window.location.hostname.includes("netlify");
let routerInitialized = false;

if (isDev) {
  console.log("🚀 main.mjs loaded successfully");
  console.log("Current pathname:", window.location.pathname);
  console.log("Current hostname:", window.location.hostname);
}
console.log("Is production:", window.location.hostname.includes("netlify"));

// Route handlers
function handleIndexPage() {
  console.log("📄 Index page");
}

function handleLoginPage() {
  console.log("🔐 Login page");
  loginHandler();
}

function handleRegisterPage() {
  console.log("📝 Register page");
  setupRegisterForm();
}

function handleListingsPageRoute() {
  console.log("📋 Listings page - calling handlers");
  setupListingsPage();
  setupCreateListingModal();
  createListingHandler();
}

function handleCreateListingPage() {
  console.log("📝 Create listing page");
  setupCreateListingModal();
}

function handleItemPage() {
  console.log("📦 Item page");
}

function handleProfilePage() {
  console.log("👤 Profile page");
  loadUserProfile();
  setupCreateListingModal();
  createListingHandler();
}

function handleEditProfilePage() {
  console.log("✏️ Edit profile page");
  loadUserProfile();
  setupEditProfileForm();
  setupChangePhotoModal();
}

function handleContactPage() {
  console.log("📧 Contact page");
  setupContactForm();
}

// Route configuration
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
  try {
    const pathname = window.location.pathname;

    if (isDev) {
      console.log("🔍 Router called with pathname:", pathname);
    }

    // Setup common functionality for all pages
    updateNavigation();
    setupLogoutListeners();

    // Execute route handler
    const handler = routes[pathname];
    if (handler) {
      handler();
    } else {
      console.log("❓ Unknown page:", pathname);
    }
  } catch (error) {
    console.error("💥 Router error:", error);
  }
}

function initializeRouter() {
  if (routerInitialized) {
    if (isDev) {
      console.log("🔄 Router already initialized, skipping...");
    }
    return;
  }
  routerInitialized = true;

  if (isDev) {
    console.log("📄 DOM loaded, initializing router...");
    console.log("📄 Document state:", {
      readyState: document.readyState,
      hasBody: !!document.body,
      bodyChildren: document.body?.children.length,
    });
  }

  router();

  if (isDev) {
    console.log("🎯 Application routing initialized");
  }
}

// Initialize router when DOM is ready
document.addEventListener("DOMContentLoaded", initializeRouter);

// Fallback for when DOM is already loaded
if (document.readyState !== "loading") {
  initializeRouter();
}

// Optional: Window load event for additional debugging
if (isDev) {
  window.addEventListener("load", () => {
    console.log("🎬 Window fully loaded");
  });

  console.log("📝 main.mjs file fully processed");
}
