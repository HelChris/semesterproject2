import { createFormHandler } from "/js/utils/form-handler.mjs";
import {
  validateName,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
} from "/js/utils/validation.mjs";
import { register } from "/js/auth/register.mjs";
import { showError } from "/js/shared/error-handling.mjs";
import { showSuccess } from "/js/shared/success-registration-handling.mjs";

function validateTerms(value) {
  return value === "on"
    ? { isValid: true }
    : { isValid: false, message: "You must agree to the Terms of Service." };
}

export function setupRegisterForm() {
  createFormHandler(
    "#registerForm",
    {
      name: [validateName],
      email: [validateEmail],
      password: [validatePassword],
      confirmPassword: [
        (value, formData) => validateConfirmPassword(formData.password, value),
      ],
      terms: [validateTerms],
    },
    async (formData) => {
      try {
        await register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });
        showSuccess("Registration successful!", "#message");
        const form = document.querySelector("#registerForm");
        if (form) form.reset();
        setTimeout(() => {
          window.location.href = "/pages/login.html";
        }, 1500);
      } catch (error) {
        showError(error.message, "#message");
      }
    },
  );
}
