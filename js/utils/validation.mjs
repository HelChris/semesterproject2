export function validateRequired(
  value,
  _formData,
  message = "This field is required",
) {
  return value?.trim() ? { isValid: true } : { isValid: false, message };
}

export function validateName(value, _formData) {
  if (!value || !value.trim()) {
    return { isValid: false, message: "Name field is required" };
  }
  if (value.trim().length < 2) {
    return { isValid: false, message: "Name must be at least 2 characters" };
  }
  return { isValid: true };
}

export function validateEmail(value) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!value.trim()) return { isValid: false, message: "Email is required" };
  if (!pattern.test(value)) return { isValid: false, message: "Invalid email" };
  if (!value.endsWith("@stud.noroff.no"))
    return { isValid: false, message: "Only @stud.noroff.no emails allowed" };
  return { isValid: true };
}

export function validatePassword(value) {
  if (!value) return { isValid: false, message: "Password is required" };
  if (value.length < 8) return { isValid: false, message: "Min 8 characters" };
  return { isValid: true };
}

export function validateConfirmPassword(password, confirm) {
  if (!confirm) return { isValid: false, message: "Confirm your password" };
  if (password !== confirm)
    return { isValid: false, message: "Passwords do not match" };
  return { isValid: true };
}
