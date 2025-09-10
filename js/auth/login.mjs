import { AUTH_ENDPOINTS } from "/js/constants/endpoints.mjs";
import { addToLocalStorage } from "/js/utils/local-storage.mjs";
import { showError } from "/js/shared/error-handling.mjs";

/**
 * Authenticates a user by sending login credentials to the server
 *
 * @param {Object} user - The user credentials object
 * @param {string} user.email - The user's email address
 * @param {string} user.password - The user's password
 * @returns {Promise<Object>} A promise that resolves to the server response with user data
 * @throws {Error} If the login fails or server returns an error
 *
 * @example
 * // Attempt to login a user
 * try {
 *   const userData = await login({
 *     email: "user@example.com",
 *     password: "securePassword123"
 *   });
 *   console.log("Login successful:", userData);
 * } catch (error) {
 *   console.error("Login failed:", error.message);
 * }
 */
export async function login(user) {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  };

  const response = await fetch(AUTH_ENDPOINTS.login, options);
  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.errors?.[0]?.message || "Oh no, login failed");
  }

  const { accessToken, name, email } = json.data;
  addToLocalStorage("accessToken", accessToken);
  addToLocalStorage("username", name);
  addToLocalStorage("email", email);

  return json;
}

export function loginHandler() {
  const form = document.querySelector("#loginForm");
  if (form) {
    form.addEventListener("submit", submitForm);
  }

  async function submitForm(event) {
    event.preventDefault();

    const form = event.target;

    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    const fieldset = form.querySelector("fieldset");

    try {
      fieldset.disabled = true;
      await login(data);
      location.href = "/index.html";
    } catch (error) {
      console.error(error);
      showError(error, "#message");
    } finally {
      fieldset.disabled = false;
    }
  }
}
