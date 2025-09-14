import { deleteAuctionListing } from "/js/api/auction-listings.mjs";
import { showError } from "/js/shared/error-handling.mjs";
import { showSuccess } from "/js/shared/success-handling.mjs";

/**
 * Delete a user's listing with confirmation
 * @param {string} listingId - The ID of the listing to delete
 * @param {string} listingTitle - The title of the listing for confirmation
 */
export async function deleteUserListing(listingId, listingTitle) {
  const confirmMessage = `Are you sure you want to delete "${listingTitle}"?\n\nThis action cannot be undone and will permanently remove your listing.`;

  if (!confirm(confirmMessage)) {
    return;
  }

  // Second confirmation for safety
  const doubleConfirm = confirm(
    "This is your final warning. The listing will be permanently deleted. Are you absolutely sure?",
  );
  if (!doubleConfirm) {
    return;
  }

  try {
    await deleteAuctionListing(listingId);

    showSuccess("Listing deleted successfully!", null, {
      isToast: true,
      duration: 2000,
    });

    // Remove the card from DOM
    const cardElement = document
      .querySelector(`[data-listing-id="${listingId}"]`)
      ?.closest(".bg-white");
    if (cardElement) {
      cardElement.remove();
    }

    setTimeout(() => {
      window.location.reload();
    }, 1000);
  } catch (error) {
    showError(error.message || "Failed to delete listing. Please try again.");
  }
}
