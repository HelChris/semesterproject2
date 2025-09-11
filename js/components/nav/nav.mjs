import { getCurrentUser, logout } from "/js/auth/logout.mjs";

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

  // Close on backdrop click
  mobileMenu.addEventListener("click", (e) => {
    if (e.target === mobileMenu) {
      closeMobileMenu();
    }
  });

  mobileMenu.addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
      console.log("Mobile menu link clicked:", e.target.href);
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
    // User is logged in - show welcome + profile + logout
    authNav.innerHTML = `
      <span class="text-earthy-beige">Welcome, ${user.displayName}</span>
      <a href="/pages/profile.html"
         class="px-4 py-1 border-soft-teal-2 bg-earthy-beige hover:bg-soft-teal-1 hover:border-soft-teal-2 hover:text-earthy-beige border-2 rounded-3xl text-soft-teal-2 bold">
        Profile
      </a>
      <button id="logout-button"
              class="px-4 py-1 border-hover-terracotta bg-hover-terracotta hover:bg-warm-terracotta hover:border-hover-terracotta border-2 rounded-3xl text-earthy-beige text-bold shadow">
        Sign Out
      </button>
    `;

    // Add logout event listener
    const logoutButton = document.getElementById("logout-button");
    if (logoutButton) {
      logoutButton.addEventListener("click", (e) => {
        e.preventDefault();
        logout();
      });
    }
  } else {
    // User is not logged in - show login/register
    authNav.innerHTML = `
      <a href="/pages/login.html"
         class="px-4 py-1 border-warm-terracotta bg-hover-terracotta hover:bg-warm-terracotta hover:border-hover-terracotta border-2 rounded-3xl text-earthy-beige text-bold shadow">
        Sign in
      </a>
      <a href="/pages/register.html"
         class="px-4 py-1 border-soft-teal-2 bg-earthy-beige hover:bg-soft-teal-1 hover:border-soft-teal-2 hover:text-earthy-beige border-2 rounded-3xl text-soft-teal-2 bold shadow">
        Register
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
  updateMobileMenuAvatar(user);
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
        class="w-8 h-8 rounded-full border-2 border-earthy-beige object-cover"
        onerror="this.src='/img/avatar1-placeholder.jpg'"
      />
      <span class="text-earthy-beige text-sm font-medium">Hi, ${user.displayName}</span>
    `;

    mobileMenuBtn.parentNode.insertBefore(userGreeting, mobileMenuBtn);
  }
}
/**
 * Add/remove user avatar at top of mobile menu (above search)
 */
function updateMobileMenuAvatar(user) {
  const existingAvatar = document.getElementById("mobile-menu-avatar");
  if (existingAvatar) existingAvatar.remove();

  if (user) {
    const avatarElement = document.createElement("div");
    avatarElement.id = "mobile-menu-avatar";
    avatarElement.className =
      "flex justify-center align-center pb-4 border-b border-earthy-beige/20 mb-6";

    avatarElement.innerHTML = `
      <section class="flex flex-col">
        <div class="m-auto">
          <img
            src="${user.userAvatar || "/img/avatar1-placeholder.jpg"}"
            alt="${user.displayName}'s avatar"
            class="w-20 h-20 rounded-full border-2 border-earthy-beige object-cover"
            onerror="this.src='/img/avatar1-placeholder.jpg'"
          />
        </div>
        <div class=" text-earthy-beige mb-3">
            Welcome, ${user.displayName}!
          </div>
      </section>
    `;

    const mobileMenuContent =
      document.querySelector("#mobile-menu .flex-1.overflow-y-auto") ||
      document.querySelector("#mobile-menu .space-y-6");

    if (mobileMenuContent) {
      mobileMenuContent.insertBefore(
        avatarElement,
        mobileMenuContent.firstChild,
      );
    }
  }
}

/**
 * Update mobile menu auth section
 */
function updateMobileAuthSection(user) {
  const mobileAuthSection = document.getElementById("mobile-auth-section");
  if (!mobileAuthSection) return;

  if (user) {
    // User is logged in - show welcome + profile + logout)
    mobileAuthSection.innerHTML = `
      <div class="space-y-3">
        <a href="/pages/profile.html"
           class="block w-full text-center py-2 bg-earthy-beige hover:bg-soft-teal-1 text-soft-teal-2 hover:text-earthy-beige rounded-lg">
          Profile
        </a>
        <button id="mobile-logout-button"
                class="block w-full text-center py-2 bg-hover-terracotta hover:bg-warm-terracotta text-earthy-beige rounded-lg">
          Sign Out
        </button>
      </div>
    `;

    // Add mobile logout event listener
    const mobileLogoutButton = document.getElementById("mobile-logout-button");
    if (mobileLogoutButton) {
      mobileLogoutButton.addEventListener("click", (e) => {
        e.preventDefault();
        logout();
      });
    }
  } else {
    // User is not logged in - show "Account" heading + login/register
    mobileAuthSection.innerHTML = `
      <h3 class="text-earthy-beige font-semibold mb-3">Account</h3>
      <div class="space-y-3">
        <a href="/pages/login.html"
           class="block w-full text-center py-2 bg-hover-terracotta hover:bg-warm-terracotta text-earthy-beige rounded-lg">
          Sign in
        </a>
        <a href="/pages/register.html"
           class="block w-full text-center py-2 bg-earthy-beige hover:bg-soft-teal-1 text-soft-teal-2 hover:text-earthy-beige rounded-lg">
          Register
        </a>
      </div>
    `;
  }
}
