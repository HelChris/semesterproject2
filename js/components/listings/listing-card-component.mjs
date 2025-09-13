/**
 * creates a listing card element
 * @param {object} listing - The auction listing data
 * @returns {HTMLElement} the created card element
 */
export function createListingCard(listing) {
  const card = document.createElement("div");
  card.className =
    "bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow flex flex-col h-full";

  const imageUrl = listing.media?.[0]?.url || "/img/placeholder.jpg";
  const currentBid =
    listing.bids?.length > 0
      ? Math.max(...listing.bids.map((bid) => bid.amount))
      : 0;

  const bidCount = listing._count?.bids || 0;
  const timeLeft = getTimeLeft(listing.endsAt);

  card.innerHTML = `
    <div class="relative mb-4">
      <img
        src="${imageUrl}"
        alt="${listing.media?.[0]?.alt || listing.title}"
        class="w-full h-48 object-cover rounded-lg"
        onerror="this.src='/img/placeholder.jpg'"
      />
      <div class="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
        ${timeLeft}
      </div>
    </div>

    <div class="flex-1 flex flex-col">

      <h2 class="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">${listing.title}</h2>

      <div class="flex-1 mb-3">
        <p class="text-gray-600 text-lg line-clamp-3">${listing.description || "No description available"}</p>
      </div>

      <div class="flex items-center mb-3">
        <img
          src="${listing.seller?.avatar?.url || "/img/default-avatar.png"}"
          alt="${listing.seller?.name || "Unknown seller"}"
          class="w-8 h-8 rounded-full mr-2 seller-avatar"
          onerror="this.src='/img/default-avatar.png'"
        />
        <span class="text-lg text-gray-700">by ${listing.seller?.name || "Unknown"}</span>
      </div>

      <div class="flex justify-between items-center mb-4">
        <div>
          <p class="text-sm text-gray-600">${
            bidCount > 0
              ? `<p class="text-lg font-bold text-forest-green">Current bid: ${currentBid} credits</p>
               <p class="text-sm text-gray-600">${bidCount} bid${bidCount !== 1 ? "s" : ""}</p>`
              : `<p class="text-lg font-bold text-gray-500">0 Bids</p>
               <p class="text-sm text-gray-600">Be the first to bid!</p>`
          }
        </div>
        <div class="flex flex-wrap gap-1">
          ${
            listing.tags
              ?.slice(0, 2)
              .map(
                (tag) =>
                  `<span class="bg-super-soft-yellow text-black p-1 py-1 rounded text-md">${tag}</span>`,
              )
              .join("") || ""
          }
        </div>
      </div>
    </div>

    <div class="flex gap-2">
      <button
        class="flex-1 bg-warm-terracotta text-earthy-beige px-4 py-2 rounded hover:bg-hover-terracotta transition-colors"
        data-listing-id="${listing.id}"
      >
        Place Bid
      </button>
      <a
        href="/pages/item.html?id=${listing.id}"
        class="flex-1 bg-forest-green text-earthy-beige px-4 py-2 rounded hover:bg-soft-teal-2 transition-colors text-center inline-block"
      >
        View Details
      </a>
    </div>
  `;

  const placeBidButton = card.querySelector("[data-listing-id]");
  if (placeBidButton) {
    placeBidButton.addEventListener("click", () => {
      handlePlaceBid(listing.id, listing.title);
    });
  }

  return card;
}

/**
 * Calculates time left until auction ends
 * @param {string} endsAt - ISO date string
 * @returns {string} Formatted time remaining
 */
export function getTimeLeft(endsAt) {
  if (!endsAt) return "No end date";

  const now = new Date();
  const end = new Date(endsAt);
  const diff = end - now;

  if (diff <= 0) return "Ended";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h`;

  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${minutes}m`;
}

/**
 * Handle place bid action from listing card
 * @param {string} listingId - ID of the listing to bid on
 * @param {string} listingTitle - Title of the listing for context
 */
function handlePlaceBid(listingId, listingTitle) {
  const authToken = localStorage.getItem("accessToken");

  if (!authToken) {
    const confirmMessage = `Please log in to place a bid on "${listingTitle}"`;
    if (confirm(confirmMessage)) {
      const returnUrl = encodeURIComponent(window.location.href);
      window.location.href = `/pages/login.html?returnTo=${returnUrl}`;
    }
    return;
  }

  window.location.href = `/pages/item.html?id=${listingId}`;
}
