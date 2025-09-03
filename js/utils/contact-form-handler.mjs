import { createFormHandler } from "/js/utils/form-handler.mjs";
import { validateRequired, validateEmail } from "/js/utils/validation.mjs";
import { showError } from "/js/shared/error-handling.mjs";
import { showContactSuccess } from "../shared/success-contact-handling.mjs";

export function setupContactForm() {
  createFormHandler(
    "#contactForm",
    {
      title: [
        (value, formData) =>
          validateRequired(value, formData, "Title is required"),
      ],
      message: [
        (value, formData) =>
          validateRequired(value, formData, "Message is required"),
      ],
      name: [
        (value, formData) =>
          validateRequired(value, formData, "Name is required"),
      ],
      email: [validateEmail],
    },
    async () => {
      try {
        showContactSuccess("Your message has been sent!", "#message");
        const form = document.querySelector("#contactForm");
        if (form) form.reset();
      } catch (error) {
        showError(error.message, "#message");
      }
    },
  );
}

