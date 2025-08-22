/**
 * Stores a value in the browser's localStorage
 *
 * @param {string} key - The key under which to store the value
 * @param {string} value - The value to be stored
 * @returns {void}
 *
 * @example
 * // Store a user's access token
 * addToLocalStorage('accessToken', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
 * console.log('Token saved to localStorage');
 */
export function addToLocalStorage(key, value) {
  localStorage.setItem(key, value);
}

/**
 * Retrieves a value from the browser's localStorage
 *
 * @param {string} key - The key of the value to retrieve
 * @returns {string|null} The stored value if it exists, or null if it doesn't
 *
 * @example
 * // Retrieve a user's access token
 * const token = getFromLocalStorage('accessToken');
 * if (token) {
 *   console.log('Found saved token:', token);
 * } else {
 *   console.log('No token found, user needs to log in');
 * }
 */
export function getFromLocalStorage(key) {
  return localStorage.getItem(key);
}
