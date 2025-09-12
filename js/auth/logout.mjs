import { getFromLocalStorage } from "/js/utils/local-storage.mjs";

export function logout() {
  localStorage.clear();
  window.location.href = "/index.html";
}

/**
 * Get current user authentication state
 * @returns {Object|null} User data or null if not authenticated
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
 * Check if user is currently logged in
 * @returns {boolean}
 */
export function isLoggedIn() {
  return !!getCurrentUser();
}

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