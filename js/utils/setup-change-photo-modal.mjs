import { updateAvatar } from "../components/edit-profile/edit-avatar-photo.mjs";

export function setupChangePhotoModal() {
  const openBtn = document.getElementById("change-photo-modal-btn");
  const closeBtn = document.getElementById("close-photo-modal");
  const modal = document.getElementById("change-photo-modal");
  const changePhotoForm = document.getElementById("change-photo-form");
  const avatarImg = document.getElementById("profile-avatar");
  const avatarInput = document.getElementById("avatar-url"); // hidden input in edit form
  const messageDiv = document.getElementById("message");

  if (!openBtn || !closeBtn || !modal || !changePhotoForm || !avatarImg) return;

  // Open modal
  openBtn.addEventListener("click", () => {
    modal.classList.remove("hidden");
    modal.classList.add("flex");
    changePhotoForm.reset();
    if (messageDiv) messageDiv.textContent = "";
  });

  // Close modal
  closeBtn.addEventListener("click", () => {
    modal.classList.remove("flex");
    modal.classList.add("hidden");
    if (messageDiv) messageDiv.textContent = "";
  });

  // click outside modal to close modal
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("flex");
      modal.classList.add("hidden");
      if (messageDiv) messageDiv.textContent = "";
    }
  });

  // Handle avatar update
  changePhotoForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const urlInput = document.getElementById("new-photo-url");
    const newUrl = urlInput.value.trim();

    try {
      new URL(newUrl);
    } catch {
      alert(
        "Please enter a valid image URL (must start with http:// or https://)",
      );
      return;
    }

    if (newUrl) {
      try {
        await updateAvatar(newUrl);
        avatarImg.src = newUrl;
        if (avatarInput) avatarInput.value = newUrl;
        if (messageDiv) {
          messageDiv.textContent = "Avatar updated successfully!";
        }
        changePhotoForm.reset();
        setTimeout(() => {
          modal.classList.remove("flex");
          modal.classList.add("hidden");
          if (messageDiv) messageDiv.textContent = "";
        }, 1200);
      } catch (error) {
        alert("Could not update avatar: " + error.message);
      }
    }
  });
}
