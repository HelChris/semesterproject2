/**
 * Displays an error message with proper categorization
 * @param {Error|string} error - The error to display
 * @param {string} targetSelector - CSS selector for target element
 * @param {Object} options - Configuration options
 * @param {boolean} options.scrollToTop - Whether to scroll to top after showing error (default: true)
 * @param {boolean} options.showTitle - Whether to show error category titles (default: true)
 */
export function showError(error, targetSelector, options = {}) {
  const { scrollToTop = true, showTitle = true } = options;
  const targetElement = document.querySelector(targetSelector);

  if (!targetElement) {
    return;
  }

  // Clear existing content
  targetElement.textContent = "";

  // Extract error message
  let message = "";
  if (error instanceof Error) {
    message = error.message;
  } else if (typeof error === "object" && error !== null) {
    message = error.message || JSON.stringify(error);
  } else {
    message = String(error);
  }

  // Categorize error types for better UX
  let errorType = "error";
  let errorTitle = "Error";
  let borderColor = "border-red-400";
  let bgColor = "bg-red-50";
  let textColor = "text-red-700";
  let titleColor = "text-red-800";

  if (message.includes("Network error") || message.includes("fetch")) {
    errorType = "network";
    errorTitle = "Connection Problem";
    borderColor = "border-orange-400";
    bgColor = "bg-orange-50";
    textColor = "text-orange-700";
    titleColor = "text-orange-800";
  } else if (message.includes("not found") || message.includes("404")) {
    errorType = "not-found";
    errorTitle = "Not Found";
    borderColor = "border-blue-400";
    bgColor = "bg-blue-50";
    textColor = "text-blue-700";
    titleColor = "text-blue-800";
  } else if (
    message.includes("Authentication") ||
    message.includes("logged in") ||
    message.includes("401")
  ) {
    errorType = "auth";
    errorTitle = "Authentication Required";
    borderColor = "border-yellow-400";
    bgColor = "bg-yellow-50";
    textColor = "text-yellow-700";
    titleColor = "text-yellow-800";
  } else if (message.includes("Server error") || message.includes("500")) {
    errorType = "server";
    errorTitle = "Server Problem";
    borderColor = "border-purple-400";
    bgColor = "bg-purple-50";
    textColor = "text-purple-700";
    titleColor = "text-purple-800";
  }

  // Create error container with enhanced styling
  const alertDiv = document.createElement("div");
  alertDiv.className = `alert-error error-${errorType} p-4 rounded-lg border-l-4 ${borderColor} ${bgColor} mb-4`;
  alertDiv.setAttribute("role", "alert");

  // Add title if showTitle is enabled
  if (showTitle) {
    const titleElement = document.createElement("h4");
    titleElement.className = `font-semibold ${titleColor} mb-1`;
    titleElement.textContent = errorTitle;
    alertDiv.appendChild(titleElement);
  }

  // Add error message
  const messageElement = document.createElement("p");
  messageElement.className = textColor;
  messageElement.textContent = message;
  alertDiv.appendChild(messageElement);

  // Add to DOM
  targetElement.appendChild(alertDiv);

  // Handle scrolling behavior 
  if (scrollToTop) {
    const modal = targetElement.closest('[id*="modal"]');

    if (modal) {
      modal.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      const modalContent = modal.querySelector('[class*="overflow-y-auto"]');
      if (modalContent) {
        modalContent.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    } else {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }
}

/**
 * Displays a simple error message without categorization (for backwards compatibility)
 * @param {Error|string} error - The error to display
 * @param {string} targetSelector - CSS selector for target element
 * @param {Object} options - Configuration options
 */
export function showSimpleError(error, targetSelector, options = {}) {
  return showError(error, targetSelector, { ...options, showTitle: false });
}

/**
 * Displays error message without auto-scroll
 * @param {Error|string} error - The error to display
 * @param {string} targetSelector - CSS selector for target element
 */
export function showErrorNoScroll(error, targetSelector) {
  return showError(error, targetSelector, { scrollToTop: false });
}
