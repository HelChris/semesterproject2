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

// import { getFromLocalStorage } from "/js/utils/local-storage.mjs";

// export function logout() {
//   localStorage.clear();
//   window.location.href = "/index.html";
// }

// export function updateNavigation() {
//   const accessToken = getFromLocalStorage("accessToken");
//   const username = getFromLocalStorage("username");
//   const userAvatar = getFromLocalStorage("userAvatar");

//   const authNav =
//     document.querySelector("nav.auth-nav") ||
//     document.querySelector(".auth-nav") ||
//     document.querySelector("nav.flex.gap-2");

//   if (!authNav) return;

//   if (accessToken && username) {
//     const capitalizedUsername =
//       username.charAt(0).toUpperCase() + username.slice(1).toLowerCase();

//     updateMobileUserGreeting(userAvatar, capitalizedUsername);

//     authNav.innerHTML = `
//       <span class="text-earthy-beige">Welcome, ${capitalizedUsername}</span>
//       <a href="/pages/profile.html"
//          class="px-4 py-1 border-soft-teal-2 bg-earthy-beige hover:bg-soft-teal-1 hover:border-soft-teal-2 hover:text-earthy-beige border-2 rounded-3xl text-soft-teal-2 bold">
//         Profile
//       </a>
//       <button id="logout-button"
//               class="px-4 py-1 border-hover-terracotta bg-hover-terracotta hover:bg-warm-terracotta hover:border-hover-terracotta border-2 rounded-3xl text-earthy-beige text-bold shadow">
//         Sign Out
//       </button>
//     `;

//     const logoutButton = document.getElementById("logout-button");
//     if (logoutButton) {
//       logoutButton.addEventListener("click", (e) => {
//         e.preventDefault();
//         logout();
//       });
//     }
//   } else {
//     const userGreeting = document.getElementById("mobile-user-greeting");
//     if (userGreeting) userGreeting.remove();

//     authNav.innerHTML = `
//       <a href="/pages/login.html"
//          class="px-4 py-1 border-warm-terracotta bg-hover-terracotta hover:bg-warm-terracotta hover:border-hover-terracotta border-2 rounded-3xl text-earthy-beige text-bold shadow">
//         Sign in
//       </a>
//       <a href="/pages/register.html"
//          class="px-4 py-1 border-soft-teal-2 bg-earthy-beige hover:bg-soft-teal-1 hover:border-soft-teal-2 hover:text-earthy-beige border-2 rounded-3xl text-soft-teal-2 bold shadow">
//         Register
//       </a>
//     `;
//   }

//   updateMobileAuthSection(accessToken, username);
// }

// function updateMobileUserGreeting(userAvatar, capitalizedUsername) {
//   const mobileMenuBtn = document.getElementById("mobile-menu-btn");
//   if (!mobileMenuBtn) return;

//   const existingGreeting = document.getElementById("mobile-user-greeting");
//   if (existingGreeting) existingGreeting.remove();

//   const userGreeting = document.createElement("div");
//   userGreeting.id = "mobile-user-greeting";
//   userGreeting.className = "flex items-center gap-2 xl:hidden";

//   userGreeting.innerHTML = `
//     <img
//       src="${userAvatar || "/img/avatar1-placeholder.jpg"}"
//       alt="${capitalizedUsername}'s avatar"
//       class="w-8 h-8 rounded-full border-2 border-earthy-beige object-cover"
//       onerror="this.src='/img/avatar1-placeholder.jpg'"
//     />
//     <span class="text-earthy-beige text-sm font-medium">Hi, ${capitalizedUsername}</span>
//   `;

//   mobileMenuBtn.parentNode.insertBefore(userGreeting, mobileMenuBtn);
// }

// function updateMobileAuthSection(accessToken, username) {
//   const mobileAuthSection = document.getElementById("mobile-auth-section");
//   const mobileAuthDiv = document.querySelector(
//     "#mobile-auth-section .space-y-3",
//   );

//   if (!mobileAuthSection || !mobileAuthDiv) return;

//   if (accessToken && username) {
//     const capitalizedUsername =
//       username.charAt(0).toUpperCase() + username.slice(1).toLowerCase();
//     mobileAuthSection.innerHTML = `
//       <div class="space-y-3">
//         <div class="text-center text-earthy-beige mb-3">
//           Welcome, ${capitalizedUsername}!
//         </div>
//         <a href="/pages/profile.html"
//            class="block w-full text-center py-2 bg-earthy-beige hover:bg-soft-teal-1 text-soft-teal-2 hover:text-earthy-beige rounded-lg">
//           Profile
//         </a>
//         <button id="mobile-logout-button"
//                 class="block w-full text-center py-2 bg-hover-terracotta hover:bg-warm-terracotta text-earthy-beige rounded-lg">
//           Sign Out
//         </button>
//       </div>
//     `;

//     const mobileLogoutButton = document.getElementById("mobile-logout-button");
//     if (mobileLogoutButton) {
//       mobileLogoutButton.addEventListener("click", (e) => {
//         e.preventDefault();
//         logout();
//       });
//     }
//   } else {
//     mobileAuthSection.innerHTML = `
//       <h3 class="text-earthy-beige font-semibold mb-3">Account</h3>
//       <div class="space-y-3">
//         <a href="/pages/login.html"
//            class="block w-full text-center py-2 bg-hover-terracotta hover:bg-warm-terracotta text-earthy-beige rounded-lg">
//           Sign in
//         </a>
//         <a href="/pages/register.html"
//            class="block w-full text-center py-2 bg-earthy-beige hover:bg-soft-teal-1 text-soft-teal-2 hover:text-earthy-beige rounded-lg">
//           Register
//         </a>
//       </div>
//     `;
//   }
// }

// export function setupLogoutListeners() {
//   const logoutButton = document.getElementById("logout-button");
//   if (logoutButton) {
//     logoutButton.addEventListener("click", (e) => {
//       e.preventDefault();
//       logout();
//     });
//   }
// }
