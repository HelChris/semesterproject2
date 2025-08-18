import { getFromLocalStorage } from "/js/utils/localStorage.js";
/**
 * Logs out the user by clearing localStorage and redirecting to login page
 */
export function logout() {
  // Clear all items from localStorage
  localStorage.clear();

  // Redirect to login page
  window.location.href = "/index.html";
}

/**
 * Update nav to show appropriate buttons login/logout
 */

export function updateNavigation() {
  const accessToken = getFromLocalStorage("accessToken");
  const username = getFromLocalStorage("username");

  const authNav = document.querySelector(
    "nav.flex.justify-end.items-center.p-2.gap-2",
  );

  if (!authNav) return;

  if (accessToken && username) {
    const capitalizedUsername =
      username.charAt(0).toUpperCase() + username.slice(1).toLowerCase();

    //user is logged in - show profile and logout
    authNav.innerHTML = `<span class="text-earthy-beige">Welcome, ${capitalizedUsername}</span><a href="/pages/profile.html" class="px-4 py-1 border-soft-teal-2 bg-earthy-beige hover:bg-forest-green hover:border-soft-teal-2 border-2 rounded-3xl text-soft-teal-2 bold">Profile</a>
      <button id="logout-button"
        class="px-4 py-1 border-warm-terracotta bg-warm-terracotta hover:bg-hover-terracotta hover:border-hover-terracotta border-2 rounded-3xl text-earthy-beige text-bold">Sign Out</button>
    `;

    // add logout event listener
    const logoutButton = document.getElementById("logout-button");
    if (logoutButton) {
      logoutButton.addEventListener("click", (e) => {
        e.preventDefault();
        logout();
      });
    }
  } else {
    // user is not logged in - show login/register
    authNav.innerHTML = `<a href="/pages/login.html"
        class="px-4 py-1 border-warm-terracotta bg-warm-terracotta hover:bg-hover-terracotta hover:border-hover-terracotta border-2 rounded-3xl text-earthy-beige text-bold">Sign in</a>
      <a href="/pages/register.html"
        class="px-4 py-1 border-soft-teal-2 bg-earthy-beige hover:bg-forest-green hover:border-soft-teal-2 border-2 rounded-3xl text-soft-teal-2 bold">Register</a>
    `;
  }
}

/**
 * logout button event listeners on all pages
 */

export function setupLogoutListeners() {
  const logoutButton = document.getElementById("logout-button");
  if (logoutButton) {
    logoutButton.addEventListener("click", (e) => {
      e.preventDefault();
      logout();
    });
  }
}
