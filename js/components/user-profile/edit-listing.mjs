import {
  fetchAuctionById,
  updateAuctionListing,
} from "/js/api/auction-listings.mjs";
import { showError } from "/js/shared/error-handling.mjs";
import { showSuccess } from "/js/shared/success-handling.mjs";
import { getFromLocalStorage } from "/js/utils/local-storage.mjs";

export class EditListingModal {
  constructor() {
    this.modal = null;
    this.form = null;
    this.currentListingId = null;
    this.currentListingData = null;
    this.currentUser = getFromLocalStorage("username");

    this.createModal();
    this.setupEventListeners();
  }

  createModal() {
    const modalHTML = `
      <div id="edit-listing-modal" class="fixed inset-0 bg-forest-green/90 items-center justify-center z-50 hidden">
        <!-- Modal Content -->
        <section class="bg-earthy-beige rounded-3xl max-w-2xl w-full p-4 sm:p-8 m-4 relative overflow-y-auto max-h-screen shadow-lg">
          <!-- Close Button -->
          <button id="close-edit-listing-modal" class="absolute top-4 right-4 text-2xl font-bold" aria-label="Close modal">
            &times;
          </button>

          <!-- Modal Header -->
          <div class="mb-4 sm:mb-6">
            <h1 class="text-black text-center text-2xl sm:text-3xl font-medium">
              Edit Listing
            </h1>
          </div>

          <!-- Form Container -->
          <div>
            <form id="edit-listing-form" novalidate>
              <fieldset>
                <div id="edit-message"></div>

                <!-- Title field -->
                <div class="mb-4 sm:mb-5">
                  <div class="border p-2 rounded-2xl flex flex-col sm:flex-row sm:items-center gap-2">
                    <label for="edit-title" class="flex-shrink-0 min-w-fit">Title:</label>
                    <input
                      type="text"
                      id="edit-title"
                      name="title"
                      required
                      aria-describedby="edit-title-error"
                      placeholder="Enter auction title"
                      class="pl-1 w-full flex-1"
                    />
                  </div>
                  <div id="edit-title-error" class="mt-1 text-sm text-red-600 hidden" role="alert">
                    Please enter a title for your listing
                  </div>
                </div>

                <!-- Description field -->
                <div class="mb-4 sm:mb-5">
                  <div class="border p-2 rounded-2xl flex flex-col sm:flex-row sm:items-start gap-2">
                    <label for="edit-description" class="flex-shrink-0 min-w-fit sm:self-start">Description:</label>
                    <textarea
                      id="edit-description"
                      name="description"
                      required
                      aria-describedby="edit-description-error"
                      placeholder="Describe your item in detail..."
                      rows="4"
                      class="pl-1 w-full flex-1 resize-y"
                    ></textarea>
                  </div>
                  <div id="edit-description-error" class="mt-1 text-sm text-red-600 hidden" role="alert">
                    Please enter a description for your listing
                  </div>
                </div>

                <!-- Tags field -->
                <div class="mb-4 sm:mb-5">
                  <div class="border p-2 rounded-2xl flex flex-col sm:flex-row sm:items-center gap-2">
                    <label for="edit-tags" class="flex-shrink-0 min-w-fit">Tags:</label>
                    <input
                      type="text"
                      id="edit-tags"
                      name="tags"
                      aria-describedby="edit-tags-help"
                      placeholder="magical, rare, ancient (separate with commas)"
                      class="pl-1 w-full flex-1"
                    />
                  </div>
                  <div id="edit-tags-help" class="mt-1 text-sm text-gray-600 text-balance">
                    Separate tags with commas. Examples: magical items, rare collectibles, ancient books, forest artifacts
                  </div>
                </div>

                <!-- End date field -->
                <div class="mb-4 sm:mb-5">
                  <div class="border p-2 rounded-2xl flex flex-col sm:flex-row sm:items-center gap-2">
                    <label for="edit-endsAt" class="flex-shrink-0 min-w-fit">Auction End:</label>
                    <input
                      type="datetime-local"
                      id="edit-endsAt"
                      name="endsAt"
                      required
                      aria-describedby="edit-endsAt-error"
                      class="pl-1 w-full flex-1"
                    />
                  </div>
                  <div id="edit-endsAt-error" class="mt-1 text-sm text-red-600 hidden" role="alert">
                    Please select when the auction should end
                  </div>
                </div>

                <!-- Media URLs -->
                <div class="mb-4 sm:mb-5">
                  <h3 class="text-base sm:text-lg font-medium mb-3">Images</h3>

                  <!-- Image 1 -->
                  <div class="mb-3">
                    <div class="border p-2 rounded-2xl flex flex-col sm:flex-row sm:items-center gap-2">
                      <label for="edit-mediaUrl1" class="flex-shrink-0 min-w-fit">Image 1:</label>
                      <input
                        type="url"
                        id="edit-mediaUrl1"
                        name="mediaUrl1"
                        aria-describedby="edit-mediaUrl1-help"
                        placeholder="https://example.com/image1.jpg"
                        class="pl-1 w-full flex-1 text-sm sm:text-base"
                      />
                    </div>
                  </div>

                  <!-- Image 2 -->
                  <div class="mb-3">
                    <div class="border p-2 rounded-2xl flex flex-col sm:flex-row sm:items-center gap-2">
                      <label for="edit-mediaUrl2" class="flex-shrink-0 min-w-fit">Image 2:</label>
                      <input
                        type="url"
                        id="edit-mediaUrl2"
                        name="mediaUrl2"
                        aria-describedby="edit-mediaUrl2-help"
                        placeholder="https://example.com/image2.jpg"
                        class="pl-1 w-full flex-1 text-sm sm:text-base"
                      />
                    </div>
                  </div>

                  <!-- Image 3 -->
                  <div class="mb-3">
                    <div class="border p-2 rounded-2xl flex flex-col sm:flex-row sm:items-center gap-2">
                      <label for="edit-mediaUrl3" class="flex-shrink-0 min-w-fit">Image 3:</label>
                      <input
                        type="url"
                        id="edit-mediaUrl3"
                        name="mediaUrl3"
                        aria-describedby="edit-mediaUrl3-help"
                        placeholder="https://example.com/image3.jpg"
                        class="pl-1 w-full flex-1 text-sm sm:text-base"
                      />
                    </div>
                  </div>

                  <div id="edit-media-help" class="mt-1 text-sm text-gray-600 text-balance">
                    Add up to 3 images for your listing. Leave empty to remove existing images.
                  </div>
                </div>

                <!-- Submit button -->
                <div class="text-center my-4 sm:my-6">
                  <button
                    type="submit"
                    id="edit-submit-button"
                    class="px-4 sm:px-6 py-2 sm:py-3 hover:border-soft-teal-2 hover:bg-earthy-beige bg-forest-green border-soft-teal-2 border-2 rounded-3xl text-black font-bold shadow w-full max-w-80"
                  >
                    Save Changes →
                  </button>
                </div>

                <!-- Cancel link -->
                <p class="mt-4 text-center text-sm sm:text-base">
                  <button
                    type="button"
                    id="cancel-edit-btn"
                    class="text-forest-green hover:underline bg-transparent border-none cursor-pointer"
                  >
                    Cancel and close
                  </button>
                </p>
              </fieldset>
            </form>
          </div>
        </section>
      </div>
    `;

    // Insert modal into DOM
    document.body.insertAdjacentHTML("beforeend", modalHTML);

    this.modal = document.getElementById("edit-listing-modal");
    this.form = document.getElementById("edit-listing-form");
  }

  setupEventListeners() {
    const closeBtn = document.getElementById("close-edit-listing-modal");
    const cancelBtn = document.getElementById("cancel-edit-btn");

    // Close modal listeners
    closeBtn?.addEventListener("click", () => this.closeModal());
    cancelBtn?.addEventListener("click", () => this.closeModal());

    // Close on backdrop click
    this.modal?.addEventListener("click", (e) => {
      if (e.target === this.modal) {
        this.closeModal();
      }
    });


    this.form?.addEventListener("submit", (e) => this.handleSubmit(e));
  }

  async openModal(listingId) {
    try {
      this.currentListingId = listingId;


      this.clearForm();
      this.clearMessages();

      this.currentListingData = await fetchAuctionById(listingId);

      if (!this.canEditListing(this.currentListingData)) {
        showError("You can only edit your own listings.", "#edit-message");
        return;
      }


      this.populateForm(this.currentListingData);

      // Show modal
      this.modal.classList.remove("hidden");
      this.modal.classList.add("flex");
    } catch (error) {
      console.error("Error loading listing for edit:", error);
      showError(
        "Failed to load listing data. Please try again.",
        "#edit-message",
      );
    }
  }

  canEditListing(listingData) {
    // Check if current user is the seller
    const sellerName = listingData?.seller?.name;
    return sellerName === this.currentUser;
  }

  closeModal() {
    this.modal.classList.remove("flex");
    this.modal.classList.add("hidden");
    this.clearForm();
    this.clearMessages();
    this.currentListingId = null;
    this.currentListingData = null;
  }

  populateForm(listingData) {

    document.getElementById("edit-title").value = listingData.title || "";
    document.getElementById("edit-description").value =
      listingData.description || "";

    const tags = listingData.tags?.join(", ") || "";
    document.getElementById("edit-tags").value = tags;


    if (listingData.endsAt) {
      const endDate = new Date(listingData.endsAt);
      const localDateTime = endDate.toISOString().slice(0, 16);
      document.getElementById("edit-endsAt").value = localDateTime;
    }


    const media = listingData.media || [];
    document.getElementById("edit-mediaUrl1").value = media[0]?.url || "";
    document.getElementById("edit-mediaUrl2").value = media[1]?.url || "";
    document.getElementById("edit-mediaUrl3").value = media[2]?.url || "";
  }

  clearForm() {
    this.form?.reset();
  }

  clearMessages() {
    const messageDiv = document.getElementById("edit-message");
    if (messageDiv) {
      messageDiv.innerHTML = "";
    }
  }

  async handleSubmit(event) {
    event.preventDefault();

    if (!this.currentListingId) {
      showError("No listing selected for editing.", "#edit-message");
      return;
    }

    if (!this.canEditListing(this.currentListingData)) {
      showError("You can only edit your own listings.", "#edit-message");
      return;
    }

    const formData = new FormData(this.form);
    const data = Object.fromEntries(formData);


    if (!data.title || !data.description || !data.endsAt) {
      showError("Please fill in all required fields", "#edit-message");
      return;
    }


    const currentDate = new Date();
    const endDate = new Date(data.endsAt);

    if (endDate <= currentDate) {
      showError("Auction end date must be in the future", "#edit-message");
      return;
    }

    const tags = data.tags
      ? data.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag)
      : [];


    const mediaUrls = [data.mediaUrl1, data.mediaUrl2, data.mediaUrl3]
      .filter((url) => url && url.trim())
      .map((url) => ({ url: url.trim(), alt: data.title }));

    const updateData = {
      title: data.title.trim(),
      description: data.description.trim(),
      tags: tags,
      media: mediaUrls,
      endsAt: new Date(data.endsAt).toISOString(),
    };

    const fieldset = this.form.querySelector("fieldset");
    const submitButton = document.getElementById("edit-submit-button");

    try {
      fieldset.disabled = true;
      submitButton.textContent = "Saving...";

      await updateAuctionListing(this.currentListingId, updateData);

      showSuccess("Listing updated successfully!", "#edit-message", {
        isToast: true,
        duration: 3000,
      });

      // Close modal after short delay
      setTimeout(() => {
        this.closeModal();
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error("Error updating listing:", error);
      showError(
        error.message || "Failed to update listing. Please try again.",
        "#edit-message",
      );
    } finally {
      fieldset.disabled = false;
      submitButton.textContent = "Save Changes →";
    }
  }
}

// Create global instance
let editListingModal = null;

/**
 * Initialize the edit listing modal
 */
export function initializeEditListingModal() {
  if (!editListingModal) {
    editListingModal = new EditListingModal();
  }
  return editListingModal;
}

/**
 * Open edit modal for a specific listing
 * @param {string} listingId - The ID of the listing to edit
 */
export function openEditListingModal(listingId) {
  if (!editListingModal) {
    editListingModal = new EditListingModal();
  }
  editListingModal.openModal(listingId);
}

/**
 * Get the edit listing modal instance
 */
export function getEditListingModal() {
  return editListingModal;
}
