/**
 * Displays an error message in the specified target element
 *
 * This function creates and displays an error alert in the DOM element
 * specified by the selector. It handles both Error objects and string messages.
 *
 * @param {Error|string} error - The error to display (either an Error object or a string message)
 * @param {string} targetSelector - CSS selector for the target DOM element where the error will be displayed
 * @returns {void}
 *
 * @example
 * // Display an error message in the #error-container element
 * try {
 *   await loginUser(credentials);
 * } catch (error) {
 *   showError(error, '#error-container');
 *   console.error('Login failed:', error.message);
 * }
 */
export function showError(error, targetSelector) {
  const targetElement = document.querySelector(targetSelector);

  if (!targetElement) {
    console.warn(`Target element not found: ${targetSelector}`);
    return;
  }

  // clear existing content
  targetElement.textContent = "";

  //create alert container
  const alertDiv = document.createElement("div");
  alertDiv.className = "alert-error";
  alertDiv.setAttribute("role", "alert");

  //create error text node
  const errorText = document.createTextNode(
    error instanceof Error ? error.message : error,
  );
  alertDiv.appendChild(errorText);

  //add to DOM
  targetElement.appendChild(alertDiv);
}
