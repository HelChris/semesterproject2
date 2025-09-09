/**
 * Simple reusable success message function
 * @param {string} message - The success message to display
 * @param {string} [targetSelector] - Optional CSS selector for target element
 */
export function showSuccess(message, targetSelector = null) {
  if (targetSelector) {
    // Show inline message in specific element
    const target = document.querySelector(targetSelector);
    if (target) {
      target.innerHTML = `
        <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
           ${message}
        </div>
      `;
      setTimeout(() => {
        if (target.firstElementChild) {
          target.firstElementChild.remove();
        }
      }, 4000);
    }
  } else {
    // Show toast notification
    const toast = document.createElement("div");
    toast.className =
      "fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50";
    toast.innerHTML = `${message}`;

    document.body.appendChild(toast);

    // Auto-hide after 3 seconds
    setTimeout(() => {
      toast.remove();
    }, 3000);
  }
}
