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

  targetElement.textContent = "";

  const alertDiv = document.createElement("div");
  alertDiv.className = "alert-error";
  alertDiv.setAttribute("role", "alert");

  let message = "";
  if (error instanceof Error) {
    message = error.message;
  } else if (typeof error === "object" && error !== null) {
    message = error.message || JSON.stringify(error);
  } else {
    message = String(error);
  }

  const errorText = document.createTextNode(message);
  alertDiv.appendChild(errorText);

  targetElement.appendChild(alertDiv);
}

