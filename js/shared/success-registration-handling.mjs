/**
 * Displays a success message for registration with a login link
 *
 * This function creates a success alert with a login link and
 * adds it to the specified target element in the DOM.
 *
 * @param {string} message - The success message (not used in current implementation)
 * @param {string} targetSelector - CSS selector for the target DOM element
 * @returns {void}
 *
 * @example
 * // Show registration success message in the message container
 * try {
 *   await register(userData);
 *   showSuccess('', '#message');
 *   console.log('Registration successful');
 * } catch (error) {
 *   showError(error, '#message');
 * }
 */
export function showSuccess(message, targetSelector) {
  const targetElement = document.querySelector(targetSelector);

  //clear existing content
  targetElement.textContent = "";

  const alertDiv = document.createElement("div");
  alertDiv.className = "alert-success";
  alertDiv.setAttribute("role", "alert");

  //create success text node
  const successText = document.createTextNode(
    "Successfully registered. Please ",
  );
  alertDiv.appendChild(successText);

  //create login link
  const loginLink = document.createElement("a");
  loginLink.href = "/pages/login.html";
  loginLink.textContent = "login";
  loginLink.className = "text-blue-600 hover:text-blue-800 underline";
  alertDiv.appendChild(loginLink);

  //add to DOM
  targetElement.appendChild(alertDiv);
}

