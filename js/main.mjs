import { setupRegisterForm } from "./utils/register-form-handler.mjs";
import { loginHandler } from "/js/auth/login.mjs";
import { updateNavigation, setupLogoutListeners } from "/js/auth/logout.mjs";
import { fetchAuctionListings } from "/js/api/auction-listings.mjs";
import { createListingHandler } from "./utils/create-listing-handler.mjs";
import { setupContactForm } from "/js/utils/contact-form-handler.mjs";
import { setupCreateListingModal } from "./components/listings/setup-create-listing-modal.mjs";
import { setupChangePhotoModal } from "./utils/setup-change-photo-modal.mjs";
import { loadUserProfile } from "./components/user-profile/load-user-profile.mjs";
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

console.log("🚀 main.mjs loaded successfully");
console.log("Current pathname:", window.location.pathname);
console.log("Current hostname:", window.location.hostname);
console.log("Is production:", window.location.hostname.includes("netlify"));

function router() {
  const pathname = window.location.pathname;
  console.log("🔍 Router called with pathname:", pathname);

  updateNavigation();
  setupLogoutListeners();

  switch (pathname) {
    case "/":
    case "/index.html":
      console.log("📄 Index page");
      break;
    case "/pages/login.html":
    case "/pages/login":
    case "/login.html":
      console.log("🔐 Login page");
      loginHandler();
      break;
    case "/pages/register.html":
    case "/pages/register":
    case "/register.html":
      console.log("📝 Register page");
      setupRegisterForm();
      break;
    case "/pages/listings.html":
    case "/listings":
    case "/pages/listings":
    case "/listings.html":
      console.log("📋 Listings page - calling handlers");
      handleListingsPage();
      setupCreateListingModal();
      createListingHandler();
      break;
    case "/pages/create-listing.html":
    case "/pages/create-listing":
    case "/create-listing.html":
      console.log("📝 Create listing page");
      setupCreateListingModal();
      break;
    case "/pages/item.html":
    case "/pages/item":
    case "/item.html":
      console.log("📦 Item page");
      break;
    case "/pages/profile.html":
    case "/pages/profile":
    case "/profile/":
    case "/profile.html":
      console.log("👤 Profile page");
      loadUserProfile();
      handleListingsPage();
      setupCreateListingModal();
      createListingHandler();
      break;
    case "/pages/edit-profile.html":
    case "/pages/edit-profile":
    case "/edit-profile.html":
      console.log("✏️ Edit profile page");
      loadUserProfile();
      setupEditProfileForm();
      setupChangePhotoModal();
      break;
    case "/pages/contact.html":
    case "/pages/contact":
    case "/contact.html":
      console.log("📧 Contact page");
      setupContactForm();
      break;
    default:
      console.log("❓ Unknown page:", pathname);
      break;
  }
}

/**
 * Handles the listings page functionality
 */
async function handleListingsPage() {
  console.log("🎯 handleListingsPage called");
  console.log("🌍 Environment check:", {
    isDev: window.location.hostname === "localhost",
    isProd: window.location.hostname.includes("netlify"),
    hostname: window.location.hostname,
    pathname: window.location.pathname,
  });

  const postsListContainer = document.getElementById("postsList");
  console.log("📦 postsList element:", postsListContainer);
  console.log("📄 Document readyState:", document.readyState);

  if (!postsListContainer) {
    console.error("❌ Posts list container not found!");
    console.log("🔍 Available elements with 'posts' in ID:");
    document.querySelectorAll('[id*="posts"]').forEach((el) => {
      console.log("  Found element:", el.id, el);
    });
    console.log("🔍 All elements with IDs:");
    document.querySelectorAll("[id]").forEach((el) => {
      console.log("  ID:", el.id, "Tag:", el.tagName);
    });
    return;
  }

  try {
    console.log("🔄 Starting to fetch auction listings...");

    // Add API key debugging
    console.log("🔑 Importing API key...");
    const { API_KEY } = await import("/js/constants/apikey.mjs");
    console.log("🔑 API Key status:", {
      hasApiKey: !!API_KEY,
      keyLength: API_KEY?.length,
      keyPreview: API_KEY ? `${API_KEY.substring(0, 8)}...` : "No key",
      keyType: typeof API_KEY,
    });

    if (!API_KEY) {
      throw new Error("API Key is missing or undefined");
    }

    console.log("📡 Making API request...");
    const response = await fetchAuctionListings(12, 1);
    console.log("📡 API Response received:", {
      success: !!response,
      hasData: !!response?.data,
      dataLength: response?.data?.length,
      responseKeys: Object.keys(response || {}),
      fullResponse: response,
    });

    if (response && response.data && response.data.length > 0) {
      console.log("✅ Data received, creating listing cards...");
      console.log("📋 First listing sample:", response.data[0]);

      // Import the card component
      console.log("🎴 Importing card component...");
      const { createListingCard } = await import(
        "/js/components/item-cards/listing-card-component.mjs"
      );
      console.log(
        "🎴 Card component imported successfully:",
        typeof createListingCard,
      );

      // Clear existing content
      postsListContainer.innerHTML = "";
      console.log("🧹 Container cleared");

      // Create and append listing cards
      let cardCount = 0;
      let errorCount = 0;
      response.data.forEach((listing, index) => {
        try {
          console.log(
            `🎴 Creating card ${index + 1} for listing:`,
            listing.title || listing.id,
          );
          const card = createListingCard(listing);
          console.log(`🎴 Card ${index + 1} created:`, card);
          postsListContainer.appendChild(card);
          cardCount++;
          console.log(`📄 Card ${index + 1} added to container`);
        } catch (cardError) {
          errorCount++;
          console.error(`❌ Error creating card ${index + 1}:`, {
            error: cardError,
            listing: listing,
            message: cardError.message,
            stack: cardError.stack,
          });
        }
      });

      console.log(`🎉 Card creation complete:`, {
        totalListings: response.data.length,
        successfulCards: cardCount,
        errors: errorCount,
        containerChildren: postsListContainer.children.length,
      });

      if (cardCount > 0) {
        console.log(
          `✅ Successfully displayed ${cardCount} of ${response.data.length} listings`,
        );
      } else {
        console.error("❌ No cards were successfully created");
        postsListContainer.innerHTML =
          '<p class="text-center col-span-full text-red-600">Failed to create listing cards</p>';
      }
    } else {
      console.warn("⚠️ No listing data received or empty data array");
      console.log("📊 Response analysis:", {
        responseExists: !!response,
        dataExists: !!response?.data,
        isArray: Array.isArray(response?.data),
        dataType: typeof response?.data,
        dataValue: response?.data,
      });
      postsListContainer.innerHTML =
        '<p class="text-center col-span-full">No listings found.</p>';
    }
  } catch (error) {
    console.error("💥 Error in handleListingsPage:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
      cause: error.cause,
      fullError: error,
    });

    // Check if it's a network error
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      console.error("🌐 Network error detected - check API endpoint and CORS");
    }

    // Check if it's an API key error
    if (error.message.includes("API") || error.message.includes("key")) {
      console.error("🔑 API key related error - check environment variables");
    }

    if (postsListContainer) {
      postsListContainer.innerHTML = `
        <div class="text-center col-span-full text-red-600 p-4 border border-red-300 rounded">
          <h3 class="font-bold mb-2">Failed to load listings</h3>
          <p class="mb-2"><strong>Error:</strong> ${error.message}</p>
          <p class="text-sm">Check browser console for technical details.</p>
          <details class="mt-2 text-left">
            <summary class="cursor-pointer text-sm">Technical Details</summary>
            <pre class="text-xs mt-2 bg-gray-100 p-2 rounded overflow-auto">${error.stack}</pre>
          </details>
        </div>
      `;
    }
  }
}

// Wrap router call so it only runs after DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  console.log("📄 DOM loaded, initializing router...");
  console.log("📄 Document state:", {
    readyState: document.readyState,
    hasBody: !!document.body,
    bodyChildren: document.body?.children.length,
  });

  router();
  console.log("🎯 Application routing initialized");
});

// Also add a fallback in case DOMContentLoaded already fired
if (document.readyState === "loading") {
  console.log("⏳ Document still loading, waiting for DOMContentLoaded...");
} else {
  console.log("📄 Document already loaded, running router immediately...");
  router();
  console.log("🎯 Application routing initialized (immediate)");
}

// Add window load event as final fallback
window.addEventListener("load", () => {
  console.log("🎬 Window fully loaded");
});

console.log("📝 main.mjs file fully processed");
