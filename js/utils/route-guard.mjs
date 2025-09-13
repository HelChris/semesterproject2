import { isLoggedIn } from "/js/auth/logout.mjs";
import { BUTTON_STYLES } from "/js/constants/button-styles.mjs";

/**
 * Protects routes that require authentication
 * Shows a login prompt if user is not authenticated
 * @param {Object} options - Configuration options
 * @param {string} options.redirectMessage - Custom message to show
 * @param {string} options.containerSelector - Where to show the message
 * @returns {boolean} - Returns true if user is authenticated
 */
export function requireAuth(options = {}) {
  const {
    redirectMessage = "You need to be logged in to view this page.",
    containerSelector = "main",
  } = options;

  if (isLoggedIn()) {
    return true; // User is authenticated, allow access
  }

  // User is not authenticated, show login prompt
  showLoginPrompt(redirectMessage, containerSelector);
  return false;
}

/**
 * Shows a login prompt message
 * @param {string} message - Message to display
 * @param {string} containerSelector - Where to show the message
 */
function showLoginPrompt(message, containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  // Clear existing content
  container.innerHTML = "";

  // Create login prompt section
  const promptSection = document.createElement("section");
  promptSection.className =
    "min-h-screen bg-light-forest-green flex items-center justify-center p-6";

  promptSection.innerHTML = `
    <div class="bg-earthy-beige rounded-3xl max-w-md w-full p-8 text-center shadow-lg">


      <!-- Title -->
      <h1 class="text-2xl font-bold text-forest-green mb-4">
        Authentication Required
      </h1>

      <!-- Message -->
      <p class="text-gray-600 mb-6 text-balance">
        ${message}
      </p>

      <!-- Action Buttons -->
      <div class="space-y-3">
        <a href="/pages/login.html" class="${BUTTON_STYLES.PRIMARY}">
        Sign In
      </a>

        <p class="text-sm text-gray-500">
          Don't have an account?
          <a href="/pages/register.html" class="text-forest-green hover:underline font-medium">
            Create one here
          </a>
        </p>

        <div class="pt-4 border-t border-gray-200">
          <a
            href="/index.html"
            class="text-sm text-gray-500 hover:text-forest-green transition-colors"
          >
            <- Back to Homepage
          </a>
        </div>
      </div>
    </div>
  `;

  container.appendChild(promptSection);
}

/**
 * Checks authentication and shows appropriate content
 * @param {Function} authenticatedCallback - Function to call if user is authenticated
 * @param {Object} options - Options for unauthenticated users
 */
export function checkAuthAndRender(authenticatedCallback, options = {}) {
  if (requireAuth(options)) {
    // User is authenticated, run the callback
    authenticatedCallback();
  }
}
