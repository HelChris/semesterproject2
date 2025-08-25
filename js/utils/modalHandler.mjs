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
