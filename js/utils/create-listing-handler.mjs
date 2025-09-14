import { createAuctionListing } from "/js/api/auction-listings.mjs";
import { showError } from "/js/shared/error-handling.mjs";

export function createListingHandler() {
  const form = document.querySelector("#create-listing-form");
  if (form) {
    form.addEventListener("submit", submitListing);
  }
}

async function submitListing(event) {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);

  const missingFields = [];

  if (!data.title || !data.title.trim()) {
    missingFields.push("Title");
  }

  if (!data.description || !data.description.trim()) {
    missingFields.push("Description");
  }

  if (!data.endsAt) {
    missingFields.push("Auction End Date");
  }

  const hasImages = [data.mediaUrl1, data.mediaUrl2, data.mediaUrl3].some(
    (url) => url && url.trim(),
  );

  if (!hasImages) {
    missingFields.push("add minimum 1 image URL");
  }

  if (missingFields.length > 0) {
    const errorMessage = `Please fill in all required fields: ${missingFields.join(", ")}`;
    showError(errorMessage, "#message");
    scrollToErrorMessage();
    return;
  }

  const currentDate = new Date();
  const endDate = new Date(data.endsAt);

  if (endDate <= currentDate) {
    showError("Auction end date must be in the future", "#message");
    scrollToErrorMessage();
    return;
  }

  // Process tags
  const tags = data.tags
    ? data.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag)
    : [];

  // Process media URLs
  const mediaUrls = [data.mediaUrl1, data.mediaUrl2, data.mediaUrl3]
    .filter((url) => url && url.trim())
    .map((url) => ({ url: url.trim(), alt: data.title }));

  // Create listing object
  const listingData = {
    title: data.title.trim(),
    description: data.description.trim(),
    tags: tags,
    media: mediaUrls,
    endsAt: new Date(data.endsAt).toISOString(),
  };

  const fieldset = form.querySelector("fieldset");

  try {
    fieldset.disabled = true;
    await createAuctionListing(listingData);

    alert("Listing created successfully!");
    window.location.href = "/pages/listings.html";
  } catch (error) {
    showError(error, "#message");
    scrollToErrorMessage();
  } finally {
    fieldset.disabled = false;
  }
}

function scrollToErrorMessage() {
  const messageElement = document.querySelector("#message");

  if (!messageElement) return;
  // Check if we're in a modal
  const modal = messageElement.closest('[id*="modal"]');

  if (modal) {
    // We're in a modal - scroll the modal content
    const modalContent = modal.querySelector(".overflow-y-auto");
    if (modalContent) {
      modalContent.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } else {
      // Fallback: scroll the modal itself
      modal.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  } else {
    // We're on a regular page - scroll the window
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
}
