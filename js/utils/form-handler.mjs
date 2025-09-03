/**
 * @param {string} formSelector
 * @param {Object} fieldsConfig - { fieldName: [validatorFn, ...] }
 * @param {Function} onSubmit - async (formData) => {}
 */
export function createFormHandler(formSelector, fieldsConfig, onSubmit) {
  const form = document.querySelector(formSelector);
  if (!form) return;

  function showError(input, message) {
    const errorElem = form.querySelector(`#${input.name}Error`);
    if (errorElem) {
      // Always convert message to a string for safety
      if (typeof message === "object" && message !== null) {
        message = message.message || JSON.stringify(message);
      }
      errorElem.textContent = message || "";
      errorElem.classList.toggle("hidden", !message);
    }
    input.classList.toggle("is-invalid", !!message);
    input.classList.toggle("is-valid", !message);
  }

  function validateField(name, value, formData) {
    const validators = fieldsConfig[name] || [];
    for (const validator of validators) {
      const result = validator(value, formData);
      if (!result.isValid) return result.message;
    }
    return "";
  }

  function validateForm(formData) {
    let isValid = true;
    Object.keys(fieldsConfig).forEach((name) => {
      const input = form.elements[name];
      const value = formData[name];
      const message = validateField(name, value, formData);
      showError(input, message);
      if (message) isValid = false;
    });
    return isValid;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(form));
    if (!validateForm(formData)) return;
    await onSubmit(formData);
  });

  Object.keys(fieldsConfig).forEach((name) => {
    const input = form.elements[name];
    if (input) {
      input.addEventListener("input", () => {
        const formData = Object.fromEntries(new FormData(form));
        const message = validateField(name, input.value, formData);
        showError(input, message);
      });
    }
  });
}
