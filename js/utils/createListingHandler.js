import { createAuctionListing } from "/js/api/auctionListings.js";
import { showError } from "/js/shared/errorHandling.js";

/**
 * Handles the create listing form submission
 */
export function createListingHandler() {
  const form = document.querySelector("#create-listing-form");
  if (form) {
    form.addEventListener("submit", submitListing);
  }
}

/**
 * Processes the form data and creates a new listing
 */
async function submitListing(event) {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);

  // Validate required fields
  if (!data.title || !data.description || !data.endsAt) {
    showError("Please fill in all required fields", "#message");
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

    // Show success message and redirect
    alert("Listing created successfully!");
    window.location.href = "/pages/listings.html";
  } catch (error) {
    console.error(error);
    showError(error, "#message");
  } finally {
    fieldset.disabled = false;
  }
}
