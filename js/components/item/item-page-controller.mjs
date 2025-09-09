import { fetchAuctionById } from "/js/api/auction-listings.mjs";
import { ItemImageCarousel } from "/js/components/item/item-image-carousel.mjs";
import { ItemInfoRenderer } from "/js/components/item/item-info-renderer.mjs";
import { BidManager } from "/js/components/item/bid-manager.mjs";
import { BidHistoryRenderer } from "/js/components/item/bid-history-renderer.mjs";

let imageCarousel = null;
let bidManager = null;

export async function setupItemPage() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const itemId = urlParams.get("id");

    if (!itemId) {
      showItemError("No item ID provided");
      return;
    }

    console.log(`Loading item details for ID: ${itemId}`);

    const itemData = await fetchAuctionById(itemId);

    console.log("Received item data:", itemData);
    console.log("Item media:", itemData.media);

    if (!itemData) {
      showItemError("Item not found");
      return;
    }

    if (itemData.title) {
      updatePageTitle(itemData.title);
    }

    imageCarousel = new ItemImageCarousel(itemData.media || []);
    bidManager = new BidManager(itemData);

    ItemInfoRenderer.render(itemData);
    BidHistoryRenderer.render(itemData.bids || []);

    showItemContent();
  } catch (error) {
    showItemError("Failed to load item details. Please try again.", error);
  }
}

function updatePageTitle(itemTitle) {
  if (!itemTitle || typeof itemTitle !== "string") {
    console.warn("Invalid item title provided to updatePageTitle:", itemTitle);
    return;
  }

  try {
    document.title = `${itemTitle} || Spirit Bid`;

    const pageTitle = document.getElementById("page-title");
    if (pageTitle) {
      pageTitle.textContent = `${itemTitle} || Spirit Bid`;
    }

    const cleanTitle = itemTitle
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();

    if (cleanTitle) {
      const currentUrl = new URL(window.location);
      currentUrl.searchParams.set("title", cleanTitle);
      window.history.replaceState({}, "", currentUrl);
    }
  } catch (error) {
    console.error("Error updating page title:", error);
  }
}

function showItemContent() {
  const loadingContainer = document.getElementById("loading-container");
  const itemContainer = document.getElementById("item-container");

  if (loadingContainer) loadingContainer.classList.add("hidden");
  if (itemContainer) itemContainer.classList.remove("hidden");
}

function showItemError(message) {
  const loadingContainer = document.getElementById("loading-container");
  const errorContainer = document.getElementById("error-container");
  const itemContainer = document.getElementById("item-container");

  if (loadingContainer) loadingContainer.classList.add("hidden");
  if (itemContainer) itemContainer.classList.add("hidden");
  if (errorContainer) {
    errorContainer.classList.remove("hidden");
    const errorMessage = errorContainer.querySelector("p");
    if (errorMessage) {
      errorMessage.textContent = message;
    }
  }
}

export function getBidManager() {
  return bidManager;
}

export function getImageCarousel() {
  return imageCarousel;
}
