import { getCurrentUser, logout } from "/js/auth/logout.mjs";
import { BUTTON_CONFIG } from "/js/constants/button-styles.mjs";

/**
 * Initialize navigation - setup mobile menu and update auth state
 */
export function initializeNavigation() {
  setupMobileMenu();
  updateNavigation();
}

/**
 * Update both desktop and mobile navigation based on auth state
 */
export function updateNavigation() {
  updateDesktopNavigation();
  updateMobileNavigation();
}

function setupMobileMenu() {
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const closeMenuBtn = document.getElementById("close-menu-btn");

  if (!mobileMenuBtn || !mobileMenu || !closeMenuBtn) return;

  // Open mobile menu
  mobileMenuBtn.addEventListener("click", () => {
    mobileMenu.classList.remove("translate-x-full");
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";
  });

  // Close mobile menu
  const closeMobileMenu = () => {
    mobileMenu.classList.add("translate-x-full");
    document.body.style.overflow = "";
    document.body.style.position = "";
    document.body.style.width = "";
  };

  closeMenuBtn.addEventListener("click", closeMobileMenu);

  mobileMenu.addEventListener("click", (e) => {
    if (e.target.tagName === "A" || e.target.tagName === "BUTTON") {
      console.log("Mobile menu item clicked:", e.target);
      closeMobileMenu();
    }
  });
}

/**
 * Update desktop navigation auth section
 */
function updateDesktopNavigation() {
  const authNav =
    document.querySelector("nav.auth-nav") ||
    document.querySelector(".auth-nav") ||
    document.querySelector("nav.flex.gap-2");

  if (!authNav) return;

  const user = getCurrentUser();

  if (user) {
    // User is logged in - show avatar + welcome + profile + logout
    authNav.innerHTML = `
      <div class="flex items-center gap-2">
        <img
          src="${user.userAvatar || "/img/avatar1-placeholder.jpg"}"
          alt="${user.displayName}'s avatar"
          class="w-8 h-8 rounded-full border-2 border-earthy-beige object-cover shadow-lg"
          onerror="this.src='/img/avatar1-placeholder.jpg'"
        />
        <span class="text-earthy-beige text-sm font-medium hidden lg:block">Hi, ${user.displayName}</span>
      </div>

      <a href="${BUTTON_CONFIG.LOGGED_IN.desktop.profile.href}"
         class="${BUTTON_CONFIG.LOGGED_IN.desktop.profile.style}">
        ${BUTTON_CONFIG.LOGGED_IN.desktop.profile.text}
      </a>

      <button id="${BUTTON_CONFIG.LOGGED_IN.desktop.logout.id}"
              class="${BUTTON_CONFIG.LOGGED_IN.desktop.logout.style}">
        ${BUTTON_CONFIG.LOGGED_IN.desktop.logout.text}
      </button>
    `;

    // Add logout event listener
    const logoutButton = document.getElementById(
      BUTTON_CONFIG.LOGGED_IN.desktop.logout.id,
    );
    if (logoutButton) {
      logoutButton.addEventListener("click", (e) => {
        e.preventDefault();
        logout();
      });
    }
  } else {
    // User is not logged in - show login/register
    authNav.innerHTML = `
      <a href="${BUTTON_CONFIG.LOGGED_OUT.desktop.signIn.href}"
         class="${BUTTON_CONFIG.LOGGED_OUT.desktop.signIn.style}">
        ${BUTTON_CONFIG.LOGGED_OUT.desktop.signIn.text}
      </a>

      <a href="${BUTTON_CONFIG.LOGGED_OUT.desktop.register.href}"
         class="${BUTTON_CONFIG.LOGGED_OUT.desktop.register.style}">
        ${BUTTON_CONFIG.LOGGED_OUT.desktop.register.text}
      </a>
    `;
  }
}

/**
 * Update mobile navigation - both greeting and auth section
 */
function updateMobileNavigation() {
  const user = getCurrentUser();
  updateMobileUserGreeting(user);
  updateMobileAuthSection(user);
}

/**
 * Update the mobile user greeting (avatar + "Hi, Username" next to hamburger)
 */
function updateMobileUserGreeting(user) {
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  if (!mobileMenuBtn) return;

  // Remove existing greeting
  const existingGreeting = document.getElementById("mobile-user-greeting");
  if (existingGreeting) existingGreeting.remove();

  if (user) {
    // Add user greeting
    const userGreeting = document.createElement("div");
    userGreeting.id = "mobile-user-greeting";
    userGreeting.className = "flex items-center gap-2 xl:hidden";

    userGreeting.innerHTML = `
      <img
        src="${user.userAvatar || "/img/avatar1-placeholder.jpg"}"
        alt="${user.displayName}'s avatar"
        class="w-8 h-8 rounded-full border-2 border-earthy-beige object-cover shadow-lg"
        onerror="this.src='/img/avatar1-placeholder.jpg'"
      />
      <span class="text-earthy-beige text-sm font-medium">Hi, ${user.displayName}</span>
    `;

    mobileMenuBtn.parentNode.insertBefore(userGreeting, mobileMenuBtn);
  }
}

/**
 * Update mobile menu auth section with consistent, centered buttons
 */
function updateMobileAuthSection(user) {
  const mobileAuthSection = document.getElementById("mobile-auth-section");
  if (!mobileAuthSection) return;

  if (user) {
    // User is logged in - show welcome + profile + logout
    mobileAuthSection.innerHTML = `
      <h3 class="text-earthy-beige font-semibold mb-3">Account</h3>
      <div class="space-y-3">
        <div class="flex justify-center pb-4 border-b border-earthy-beige/20 mb-4">
          <div class="flex flex-col items-center">
            <img
              src="${user.userAvatar || "/img/avatar1-placeholder.jpg"}"
              alt="${user.displayName}'s avatar"
              class="w-16 h-16 rounded-full border-2 border-earthy-beige object-cover mb-2 shadow-lg"
              onerror="this.src='/img/avatar1-placeholder.jpg'"
            />
            <div class="text-earthy-beige text-center font-medium">
              Welcome, ${user.displayName}!
            </div>
          </div>
        </div>

        <!-- Centered button container -->
        <div class="flex flex-col items-center space-y-3 max-w-xs mx-auto">
          <a href="${BUTTON_CONFIG.LOGGED_IN.mobile.profile.href}"
             class="${BUTTON_CONFIG.LOGGED_IN.mobile.profile.style} w-full">
            ${BUTTON_CONFIG.LOGGED_IN.mobile.profile.text}
          </a>

          <button id="${BUTTON_CONFIG.LOGGED_IN.mobile.logout.id}"
                  class="${BUTTON_CONFIG.LOGGED_IN.mobile.logout.style} w-full">
            ${BUTTON_CONFIG.LOGGED_IN.mobile.logout.text}
          </button>
        </div>
      </div>
    `;

    // Add mobile logout event listener
    const mobileLogoutButton = document.getElementById(
      BUTTON_CONFIG.LOGGED_IN.mobile.logout.id,
    );
    if (mobileLogoutButton) {
      mobileLogoutButton.addEventListener("click", (e) => {
        e.preventDefault();
        logout();
      });
    }
  } else {
    // User is not logged in - show login/register with consistent styling
    mobileAuthSection.innerHTML = `
      <h3 class="text-earthy-beige font-semibold mb-3">Account</h3>

      <!-- Centered button container -->
      <div class="flex flex-col items-center space-y-3 max-w-xs mx-auto">
        <a href="${BUTTON_CONFIG.LOGGED_OUT.mobile.signIn.href}"
           class="${BUTTON_CONFIG.LOGGED_OUT.mobile.signIn.style} w-full">
          ${BUTTON_CONFIG.LOGGED_OUT.mobile.signIn.text}
        </a>

        <a href="${BUTTON_CONFIG.LOGGED_OUT.mobile.register.href}"
           class="${BUTTON_CONFIG.LOGGED_OUT.mobile.register.style} w-full">
          ${BUTTON_CONFIG.LOGGED_OUT.mobile.register.text}
        </a>
      </div>
    `;
  }
}
