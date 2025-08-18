/**
 * Validates that the password and confirm password fields match
 *
 * This function checks if the values in the password and confirm password
 * fields are identical. If they don't match, it displays an error message.
 *
 * @returns {boolean} True if passwords match, false otherwise
 *
 * @example
 * // Add this to a form submission handler
 * const form = document.getElementById('registerForm');
 * form.addEventListener('submit', (event) => {
 *   if (!validatePassword()) {
 *     event.preventDefault(); // Prevent form submission
 *     console.log('Password validation failed');
 *   } else {
 *     console.log('Passwords match, continuing with submission');
 *   }
 * });
 */
export function validatePassword() {
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm-password").value;
  let errorMessage = document.getElementById("password-error");

  if (!errorMessage) {
    errorMessage = document.createElement("div");
    errorMessage.id = "password-error";
    errorMessage.className = "error";
    document.getElementById("confirm-password").after(errorMessage);
  }

  if (password !== confirmPassword) {
    errorMessage.textContent = "Passwords do not match.";
    return false;
  } else {
    errorMessage.textContent = "";
  }
  return true;
}
