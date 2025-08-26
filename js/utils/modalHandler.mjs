import { updateAvatar } from "../components/editProfile/editAvatarPhoto.mjs";

export function setupCreateListingModal() {
  document.addEventListener("DOMContentLoaded", () => {
    const openModalBtn = document.getElementById("open-modal");
    const closeModalBtn = document.getElementById("close-modal");
    const modal = document.getElementById("createlisting-modal");

    if (openModalBtn && closeModalBtn && modal) {
      openModalBtn.addEventListener("click", () => {
        modal.classList.remove("hidden");
        modal.classList.add("flex");
      });

      closeModalBtn.addEventListener("click", () => {
        modal.classList.remove("flex");
        modal.classList.add("hidden");
      });

      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          modal.classList.add("hidden");
        }
      });
    }
  });
}

export function setupChangePhotoModal() {
  const openBtn = document.getElementById("change-photo-modal-btn");
  const closeBtn = document.getElementById("close-photo-modal");
  const modal = document.getElementById("change-photo-modal");
  const changePhotoForm = document.getElementById("change-photo-form");
  const avatarImg = document.getElementById("profile-avatar");
  const avatarInput = document.getElementById("avatar-url"); // optional hidden input

  if (!openBtn || !closeBtn || !modal || !changePhotoForm || !avatarImg) return;

  openBtn.addEventListener("click", () => {
    modal.classList.remove("hidden");
    modal.classList.add("flex");
  });

  closeBtn.addEventListener("click", () => {
    modal.classList.remove("flex");
    modal.classList.add("hidden");
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("flex");
      modal.classList.add("hidden");
    }
  });

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
        if (avatarInput) {
          avatarInput.value = newUrl;
        }
        modal.classList.add("hidden");
        modal.classList.remove("flex");
      } catch (error) {
        alert("Could not update avatar: " + error.message);
      }
    }
  });
}
