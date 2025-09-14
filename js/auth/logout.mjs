/**
 * @fileoverview Authentication State Management Module
 *
 * This module handles user authentication state management, including logout functionality,
 * session validation, and authentication-related UI event handling. Provides utilities
 * for checking login status and managing user session data across the application.
 *
 * Features:
 * - Complete session logout with storage cleanup
 * - Current user state retrieval and validation
 * - Authentication status checking
 * - Logout button event handling for desktop and mobile
 * - Formatted user display name generation
 * - Automatic redirect to homepage after logout
 *
 * Dependencies:
 * - getFromLocalStorage: Utility for retrieving stored session data
 *
 * Usage:
 * - Call logout() to end user session programmatically
 * - Use getCurrentUser() to get current authenticated user data
 * - Use isLoggedIn() for authentication checks
 * - Call setupLogoutListeners() to initialize logout button handlers
 *
 */
import { getFromLocalStorage } from "/js/utils/local-storage.mjs";

/**
 * Logs out the current user and redirects to homepage
 *
 * Clears all data from localStorage to end the user session and
 * automatically redirects to the homepage. This provides a complete
 * logout that removes all stored authentication and user data.
 *
 * @function logout
 * @returns {void}
 *
 * @example
 * // Programmatic logout
 * logout();
 *
 * @example
 * // Logout with confirmation
 * if (confirm('Are you sure you want to logout?')) {
 *   logout();
 * }
 */
export function logout() {
  localStorage.clear();
  window.location.href = "/index.html";
}

/**
 * Get current user authentication state and data
 *
 * Retrieves stored authentication data from localStorage and returns
 * a formatted user object with authentication token, username, avatar,
 * and display name. Returns null if user is not authenticated.
 *
 * @function getCurrentUser
 * @returns {Object|null} User data object or null if not authenticated
 * @returns {string} returns.accessToken - JWT authentication token
 * @returns {string} returns.username - User's username (original case)
 * @returns {string|null} returns.userAvatar - URL to user's avatar image
 * @returns {string} returns.displayName - Formatted username for display (Title Case)
 *
 * @example
 * // Check current user and display info
 * const user = getCurrentUser();
 * if (user) {
 *   console.log(`Welcome back, ${user.displayName}!`);
 *   console.log(`Token: ${user.accessToken}`);
 * } else {
 *   console.log('No user is logged in');
 * }
 *
 * @example
 * // Use in conditional rendering
 * const user = getCurrentUser();
 * if (user?.userAvatar) {
 *   showUserAvatar(user.userAvatar);
 * } else {
 *   showDefaultAvatar();
 * }
 */
export function getCurrentUser() {
  const accessToken = getFromLocalStorage("accessToken");
  const username = getFromLocalStorage("username");
  const userAvatar = getFromLocalStorage("userAvatar");

  if (!accessToken || !username) {
    return null;
  }

  return {
    accessToken,
    username,
    userAvatar,
    displayName:
      username.charAt(0).toUpperCase() + username.slice(1).toLowerCase(),
  };
}

/**
 * Check if a user is currently logged in
 *
 * Simple boolean check for authentication status by verifying
 * that getCurrentUser() returns valid user data. Useful for
 * conditional logic and route protection.
 *
 * @function isLoggedIn
 * @returns {boolean} True if user is authenticated, false otherwise
 *
 * @example
 * // Conditional navigation
 * if (isLoggedIn()) {
 *   showDashboard();
 * } else {
 *   showLoginForm();
 * }
 *
 * @example
 * // Route protection
 * if (!isLoggedIn()) {
 *   window.location.href = '/pages/login.html';
 *   return;
 * }
 */
export function isLoggedIn() {
  return !!getCurrentUser();
}
/**
 * Sets up event listeners for logout buttons on desktop and mobile
 *
 * Initializes click event handlers for both desktop and mobile logout buttons.
 * Prevents default link behavior and calls logout function. Handles cases
 * where logout buttons may not be present on the page.
 *
 * @function setupLogoutListeners
 * @returns {void}
 *
 * @example
 * // Initialize logout functionality on page load
 * document.addEventListener('DOMContentLoaded', () => {
 *   setupLogoutListeners();
 * });
 *
 * @example
 * // Initialize after dynamic content update
 * updateNavigationMenu();
 * setupLogoutListeners();
 */
export function setupLogoutListeners() {
  const logoutButton = document.getElementById("logout-button");
  if (logoutButton) {
    logoutButton.addEventListener("click", (e) => {
      e.preventDefault();
      logout();
    });
  }

  const mobileLogoutButton = document.getElementById("mobile-logout-button");
  if (mobileLogoutButton) {
    mobileLogoutButton.addEventListener("click", (e) => {
      e.preventDefault();
      logout();
    });
  }
}
