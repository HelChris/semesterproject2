/**
 * @fileoverview User Registration Module
 *
 * This module handles user registration functionality for the auction platform,
 * providing account creation capabilities with automatic authentication setup.
 * Manages new user registration, token storage, and initial session establishment.
 *
 * Features:
 * - New user account creation via API
 * - Automatic authentication token storage
 * - User session data initialization
 * - Comprehensive error handling for registration failures
 * - Direct login after successful registration
 *
 * Dependencies:
 * - AUTH_ENDPOINTS: API endpoint configuration for registration
 * - addToLocalStorage: Local storage utility for session data persistence
 *
 * Usage:
 * - Call register() with user credentials to create new account
 * - Typically used in registration form submission handlers
 * - Automatically establishes user session on successful registration
 *
 */
import { AUTH_ENDPOINTS } from "/js/constants/endpoints.mjs";
import { addToLocalStorage } from "/js/utils/local-storage.mjs";

/**
 * Registers a new user account and establishes authentication session
 *
 * Sends a POST request to the registration endpoint with user credentials,
 * processes the response, and automatically stores authentication data in
 * local storage. Provides immediate login after successful registration.
 *
 * @async
 * @function register
 * @param {Object} user - The user registration data object
 * @param {string} user.name - The user's chosen username (required)
 * @param {string} user.email - The user's email address (required)
 * @param {string} user.password - The user's password (required)
 * @param {string} [user.bio] - Optional user biography/description
 * @param {Object} [user.avatar] - Optional avatar object
 * @param {string} [user.avatar.url] - URL to user's avatar image
 * @param {string} [user.avatar.alt] - Alt text for avatar image
 * @param {Object} [user.banner] - Optional banner object
 * @param {string} [user.banner.url] - URL to user's banner image
 * @param {string} [user.banner.alt] - Alt text for banner image
 * @param {Object} [user.venueManager] - Optional venue manager status (defaults to false)
 *
 * @returns {Promise<Object>} A promise that resolves to the server response with user data
 * @returns {Object} returns.data - User data object from server
 * @returns {string} returns.data.accessToken - JWT authentication token
 * @returns {string} returns.data.name - User's username
 * @returns {string} returns.data.email - User's email address
 * @returns {Object} [returns.data.avatar] - User's avatar information
 * @returns {Object} [returns.data.banner] - User's banner information
 * @returns {string} [returns.data.bio] - User's biography
 * @returns {boolean} returns.data.venueManager - Venue manager status
 *
 * @throws {Error} If registration fails or server returns an error
 * @throws {Error} If network request fails
 * @throws {Error} If required credentials are missing or invalid
 * @throws {Error} If username or email already exists
 *
 * @example
 * // Basic user registration
 * try {
 *   const userData = await register({
 *     name: "johndoe",
 *     email: "john@example.com",
 *     password: "securePassword123"
 *   });
 *   console.log("Registration successful:", userData);
 *   // User is automatically logged in
 * } catch (error) {
 *   console.error("Registration failed:", error.message);
 * }
 *
 * @example
 * // Registration with optional profile data
 * const newUser = await register({
 *   name: "janedoe",
 *   email: "jane@example.com",
 *   password: "strongPassword456",
 *   bio: "Art enthusiast and collector",
 *   avatar: {
 *     url: "https://example.com/avatar.jpg",
 *     alt: "Jane's profile picture"
 *   },
 *   venueManager: true
 * });
 *
 * @example
 * // Registration with form data
 * const formData = new FormData(registrationForm);
 * const userData = Object.fromEntries(formData);
 * const result = await register(userData);
 */
export async function register(user) {
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  };

  const response = await fetch(AUTH_ENDPOINTS.register, options);
  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.errors?.[0]?.message || "Oh no, registration failed");
  }

  const { accessToken, name, email } = json.data;
  addToLocalStorage("accessToken", accessToken);
  addToLocalStorage("username", name);
  addToLocalStorage("email", email);

  return json;
}
