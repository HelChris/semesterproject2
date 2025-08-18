import { AUTH_ENDPOINTS } from "/js/constants/endpoints.js";
import { addToLocalStorage } from "/js/utils/localStorage.js";
import { showError } from "/js/shared/errorHandling.js";
import { validatePassword } from "/js/utils/validatePassword.js";
/**
 * Registers a new user by sending credentials to the server
 *
 * @param {Object} user - The user registration data
 * @param {string} user.name - The user's name
 * @param {string} user.email - The user's email address
 * @param {string} user.password - The user's password
 * @returns {Promise<Object>} A promise that resolves to the server response with user data
 * @throws {Error} If the registration fails or server returns an error
 *
 * @example
 * // Register a new user
 * try {
 *   const userData = await register({
 *     name: "John Doe",
 *     email: "john@example.com",
 *     password: "securePassword123"
 *   });
 *   console.log("Registration successful:", userData);
 * } catch (error) {
 *   console.error("Registration failed:", error.message);
 * }
 */
export async function register(user) {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  };

  const response = await fetch(AUTH_ENDPOINTS.register, options);
  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.errors?.[0]?.message || "Oh no, registration failed");
  }

  // Store user data in localStorage after successful registration
  const { accessToken, name, email } = json.data;
  addToLocalStorage("accessToken", accessToken);
  addToLocalStorage("username", name);
  addToLocalStorage("email", email);

  return json;
}

/**
 * Sets up event handlers for the registration form and processes form submissions
 *
 * This function attaches event listeners to the registration form for password validation
 * and form submission. It processes the form data, performs necessary transformations,
 * and submits it to the registration API.
 *
 * @returns {void}
 *
 * @example
 * // Initialize the registration form handler
 * document.addEventListener('DOMContentLoaded', () => {
 *   registerHandler();
 *   console.log('Registration form handler initialized');
 * });
 */
export function registerHandler() {
  const form = document.querySelector("#registerForm");
  if (form) {
    form.addEventListener("submit", validatePassword);
    form.addEventListener("submit", submitForm);
  }

  async function submitForm(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    console.log(data);

    if (data.password !== data["confirm-password"]) {
      showError(new Error("Passwords do not match"), "#message");
      return;
    }

    //remove confirm-password + agree to terms from API data
    delete data["confirm-password"];
    delete data.terms;

    if (data.bio.trim() === "") {
      delete data.bio;
    }

    if (data.avatarUrl.trim() === "") {
      delete data.avatarUrl;
    } else {
      data.avatar = {
        url: data.avatarUrl,
        alt: `${data.name}'s avatar`,
      };
      delete data.avatarUrl;
    }

    if (data.bannerUrl.trim() === "") {
      delete data.bannerUrl;
    } else {
      data.banner = {
        url: data.bannerUrl,
        alt: `${data.name}'s banner`,
      };
      delete data.bannerUrl;
    }

    const fieldset = form.querySelector("fieldset");

    try {
      fieldset.disabled = true;
      await register(data);

      window.location.href = "/index.html";
    } catch (error) {
      console.error(error);
      showError(error, "#message");
    } finally {
      fieldset.disabled = false;
    }
  }
}
