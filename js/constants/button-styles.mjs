export const BUTTON_STYLES = {
  // Primary: Soft teal background with white text
  PRIMARY: "btn-primary",
  PRIMARY_MOBILE: "btn-primary-mobile",
  PRIMARY_COMPACT: "btn-primary-compact",

  // Secondary: White background with soft teal text
  SECONDARY: "btn-secondary",
  SECONDARY_MOBILE: "btn-secondary-mobile",
  SECONDARY_COMPACT: "btn-secondary-compact",
};

/**
 * Button configuration for different authentication states
 */
export const BUTTON_CONFIG = {
  LOGGED_OUT: {
    desktop: {
      signIn: {
        text: "Sign in",
        href: "/pages/login.html",
        style: BUTTON_STYLES.PRIMARY,
      },
      register: {
        text: "Register",
        href: "/pages/register.html",
        style: BUTTON_STYLES.SECONDARY,
      },
    },
    mobile: {
      signIn: {
        text: "Sign in",
        href: "/pages/login.html",
        style: BUTTON_STYLES.PRIMARY_MOBILE,
      },
      register: {
        text: "Register",
        href: "/pages/register.html",
        style: BUTTON_STYLES.SECONDARY_MOBILE,
      },
    },
  },

  LOGGED_IN: {
    desktop: {
      profile: {
        text: "Profile",
        href: "/pages/profile.html",
        style: BUTTON_STYLES.PRIMARY,
      },
      logout: {
        text: "Sign Out",
        id: "logout-button",
        style: BUTTON_STYLES.SECONDARY,
      },
    },
    mobile: {
      profile: {
        text: "Profile",
        href: "/pages/profile.html",
        style: BUTTON_STYLES.PRIMARY_MOBILE,
      },
      logout: {
        text: "Sign Out",
        id: "mobile-logout-button",
        style: BUTTON_STYLES.SECONDARY_MOBILE,
      },
    },
  },
};
