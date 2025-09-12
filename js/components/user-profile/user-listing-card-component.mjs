import { getTimeLeft } from "/js/components/listings/listing-card-component.mjs";
import { openEditListingModal } from "/js/components/user-profile/edit-listing.mjs";
import { deleteUserListing } from "/js/components/user-profile/delete-listing.mjs";


/**
 * Creates a listing card for user's own listings with edit/delete buttons
 * @param {Object} listing - The listing data
 * @returns {HTMLElement} The created card element
 */
export function createUserListingCard(listing) {
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

      <div class="mb-3">
        <div class="flex justify-between items-center">
          <div>
            <p class="text-lg font-bold text-forest-green">
              Current bid: ${currentBid} credits
            </p>
            <p class="text-sm text-gray-600">
              ${bidCount} bid${bidCount !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </div>

      <div class="flex flex-wrap gap-1 mb-4">
        ${
          listing.tags
            ?.slice(0, 2)
            .map(
              (tag) =>
                `<span class="bg-soft-yellow text-soft-teal-2 px-3 py-1 rounded text-md">${tag}</span>`,
            )
            .join("") || ""
        }
      </div>
    </div>

    <div class="flex gap-2">
      <a
        href="/pages/item.html?id=${listing.id}"
        class="flex-1 bg-forest-green text-earthy-beige py-2 rounded hover:bg-soft-teal-2 transition-colors text-center"
      >
        View Details
      </a>
      <button
        class="flex-1 bg-soft-teal-2 text-earthy-beige py-2 rounded hover:bg-soft-teal-1 transition-colors edit-listing-btn"
        data-listing-id="${listing.id}"
      >
        Edit
      </button>
      <button
        class="flex-1 bg-warm-terracotta text-earthy-beige py-2 rounded hover:bg-hover-terracotta transition-colors delete-listing-btn"
        data-listing-id="${listing.id}"
        data-listing-title="${listing.title}"
      >
        Delete
      </button>
    </div>
  `;

  // Add event listeners
  const editBtn = card.querySelector(".edit-listing-btn");
  const deleteBtn = card.querySelector(".delete-listing-btn");

  editBtn.addEventListener("click", () => {
    openEditListingModal(listing.id);
  });

  deleteBtn.addEventListener("click", () => {
    deleteUserListing(listing.id, listing.title);
  });

  return card;
}
