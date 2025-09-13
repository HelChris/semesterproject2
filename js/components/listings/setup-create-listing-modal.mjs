import { requireAuth } from "/js/utils/route-guard.mjs";

export function setupCreateListingModal() {
  const modal = document.getElementById("createlisting-modal");
  const closeBtn = document.getElementById("close-createlisting-modal");
  const openBtnProfile = document.getElementById(
    "create-listing-modal-profile",
  );
  const openBtnListings = document.getElementById(
    "create-listing-modal-listings",
  );

  if (!modal || !closeBtn) return;

  function openModal() {
    const isAuthenticated = requireAuth({
      redirectMessage:
        "You need to be logged in to create a listing. Please sign in to continue.",
      containerSelector: "body",
    });

    if (isAuthenticated) {
      modal.classList.remove("hidden");
      modal.classList.add("flex");
    }
  }
  function closeModal() {
    modal.classList.remove("flex");
    modal.classList.add("hidden");
  }

  if (openBtnProfile) openBtnProfile.addEventListener("click", openModal);
  if (openBtnListings) openBtnListings.addEventListener("click", openModal);
  closeBtn.addEventListener("click", closeModal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
}
