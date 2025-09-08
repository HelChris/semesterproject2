/**
 * creates a listing card element
 * @param {object} listing - The auction listing data
 * @returns {HTMLElement} the created card element
 */

export function createListingCard(listing) {
  const card = document.createElement("div");
  card.className =
    "bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow";

  const imageUrl = listing.media?.[0]?.url;
  const currentBid = listing.bids?.[0]?.amount || 0;
  const bidCount = listing._count?.bids || 0;
  const timeLeft = getTimeLeft(listing.endsAt);

  card.innerHTML = `
  <div class="relative">
      <img
        src="${imageUrl}"
        alt="${listing.media?.[0]?.alt || listing.title}"
        class="w-full h-48 object-cover rounded-lg mb-4"
      />
      <div class="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
        ${timeLeft}
      </div>
    </div>

    <h2 class="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">${listing.title}</h2>

    <p class="text-gray-600 mb-3 line-clamp-3">${listing.description || "No description available"}</p>

    <div class="flex items-center mb-3">
      <img
        src="${listing.seller?.avatar?.url}"
        alt="${listing.seller?.name}"
        class="w-8 h-8 rounded-full mr-2 seller-avatar"
      />
      <span class="text-sm text-gray-700">by ${listing.seller?.name || "Unknown"}</span>
    </div>

    <div class="flex justify-between items-center mb-4">
      <div>
        <p class="text-sm text-gray-600">${bidCount} bid${bidCount !== 1 ? "s" : ""}</p>
        <p class="text-lg font-bold text-forest-green">$${currentBid}</p>
      </div>
      <div class="flex flex-wrap gap-1">
        ${
          listing.tags
            ?.slice(0, 2)
            .map(
              (tag) =>
                `<span class="bg-soft-yellow text-soft-teal-2 px-2 py-1 rounded text-xs">${tag}</span>`,
            )
            .join("") || ""
        }
      </div>
    </div>

    <div class="flex gap-2">
      <button
        class="flex-1 bg-warm-terracotta text-earthy-beige px-4 py-2 rounded hover:bg-hover-terracotta transition-colors"
        onclick="placeBid('${listing.id}')"
      >
        Place Bid
      </button>
      <a
        href="/pages/item.html?id=${listing.id}"
        class="flex-1 bg-forest-green text-earthy-beige px-4 py-2 rounded hover:bg-soft-teal-2 transition-colors text-center"
      >
        View Details
      </a>
    </div>
  `;

  return card;
}

/**
 * Calculates time left until auction ends
 * @param {string} endsAt - ISO date string
 * @returns {string} Formatted time remaining
 */

function getTimeLeft(endsAt) {
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
 * Placeholder function for placing bids
 * @param {string} listingId - ID of the listing to bid on
 */

function placeBid(listingId) {
  // This will be implemented with your bid functionality
  console.log(`Place bid on listing: ${listingId}`);
  alert(`Bid functionality coming soon for listing: ${listingId}`);
}

// Make placeBid available globally so onclick can access it
window.placeBid = placeBid;
