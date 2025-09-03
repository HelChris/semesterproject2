/**
 * Displays a success message for the contact form
 *
 * @param {string} message - The success message to display
 * @param {string} targetSelector - CSS selector for the target DOM element
 */
export function showContactSuccess(message, targetSelector) {
  const targetElement = document.querySelector(targetSelector);

  targetElement.textContent = "";

  const alertDiv = document.createElement("div");
  alertDiv.className = "alert-success";
  alertDiv.setAttribute("role", "alert");


  const successText = document.createTextNode(message);
  alertDiv.appendChild(successText);


  targetElement.appendChild(alertDiv);
}

