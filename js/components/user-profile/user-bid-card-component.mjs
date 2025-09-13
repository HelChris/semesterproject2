import { getTimeLeft } from "/js/components/listings/listing-card-component.mjs";

/**
 * Creates a bid card element for user's active bids
 * @param {Object} bid - The bid data with listing info
 * @returns {HTMLElement} The created bid card element
 */
export function createUserBidCard(bid) {
  const card = document.createElement("div");
  card.className =
    "bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow flex flex-col h-full";

  const listing = bid.listing;
  const imageUrl = listing?.media?.[0]?.url || "/img/placeholder.jpg";
  const timeLeft = getTimeLeft(listing.endsAt);

  const userBidAmount = bid.amount;
  const isAuctionEnded = new Date(listing.endsAt) <= new Date();

  card.innerHTML = `
    <div class="relative mb-4">
      <img
        src="${imageUrl}"
        alt="${listing?.media?.[0]?.alt || listing?.title}"
        class="w-full h-48 object-cover rounded-lg"
        onerror="this.src='/img/placeholder.jpg'"
      />
      <div class="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
        ${timeLeft}
      </div>
      ${isAuctionEnded ? '<div class="absolute top-2 left-2 bg-gray-600 text-white px-2 py-1 rounded text-sm font-bold">Ended</div>' : ""}
    </div>

    <div class="flex-1 flex flex-col">
      <h2 class="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">${listing?.title || "Unknown Listing"}</h2>

      <div class="flex-1 mb-3">
        <p class="text-gray-600 text-lg line-clamp-3">${listing?.description || "No description available"}</p>
      </div>

      <div class="mb-3">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-lg font-bold text-forest-green">
              Your bid: ${userBidAmount} credits
            </p>
          </div>
          <div class="text-right">
            <span class="text-sm ${isAuctionEnded ? "text-gray-500" : "text-white p-1 bg-light-forest-green/80 rounded-full"}">
              ${isAuctionEnded ? "Ended" : "Active"}
            </span>
          </div>
        </div>
      </div>

      <div class="flex flex-wrap gap-1 mb-4">
        ${
          listing.tags
            ?.slice(0, 2)
            .map(
              (tag) =>
                `<span class="bg-super-soft-yellow text-black px-3 py-1 rounded text-md">${tag}</span>`,
            )
            .join("") || ""
        }
      </div>
    </div>

    <div class="flex gap-2">
      <a
        href="/pages/item.html?id=${listing?.id}"
        class="flex-1 bg-forest-green text-earthy-beige py-2 rounded hover:bg-soft-teal-2 transition-colors text-center inline-block"
      >
        View Listing
      </a>
      ${
        !isAuctionEnded
          ? `
        <button
          class="flex-1 bg-warm-terracotta text-earthy-beige py-2 rounded hover:bg-hover-terracotta transition-colors"
          onclick="window.location.href='/pages/item.html?id=${listing?.id}'"
        >
          Bid Higher
        </button>
      `
          : ""
      }
    </div>
  `;

  return card;
}