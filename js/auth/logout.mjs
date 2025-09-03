import { getFromLocalStorage } from "/js/utils/local-storage.mjs";

export function logout() {
  localStorage.clear();
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
    authNav.innerHTML = `<span class="text-earthy-beige">Welcome, ${capitalizedUsername}</span><a href="/pages/profile.html" class="px-4 py-1 border-soft-teal-2 bg-earthy-beige hover:bg-soft-teal-1 hover:border-soft-teal-2 hover:text-earthy-beige border-2 rounded-3xl text-soft-teal-2 bold">Profile</a>
      <button id="logout-button"
        class="px-4 py-1 border-hover-terracotta bg-hover-terracotta hover:bg-warm-terracotta hover:border-hover-terracotta border-2 rounded-3xl text-earthy-beige text-bold shadow">Sign Out</button>
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
        class="px-4 py-1 border-warm-terracotta bg-hover-terracotta hover:bg-warm-terracotta hover:border-hover-terracotta border-2 rounded-3xl text-earthy-beige text-bold shadow">Sign in</a>
      <a href="/pages/register.html"
        class="px-4 py-1 border-soft-teal-2 bg-earthy-beige hover:bg-soft-teal-1 hover:border-soft-teal-2 hover:text-earthy-beige border-2 rounded-3xl text-soft-teal-2 bold shadow">Register</a>
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

