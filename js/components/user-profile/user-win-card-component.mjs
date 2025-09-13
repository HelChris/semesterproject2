/**
 * Creates a win card element for user's auction wins
 * @param {Object} win - The won auction data
 * @returns {HTMLElement} The created win card element
 */
export function createUserWinCard(win) {
  const card = document.createElement("div");
  card.className =
    "bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow flex flex-col h-full border-2 border-forest-green";

  const imageUrl = win.media?.[0]?.url || "/img/placeholder.jpg";
  const winningBid =
    win.bids?.length > 0 ? Math.max(...win.bids.map((bid) => bid.amount)) : 0;

  const endDate = new Date(win.endsAt).toLocaleDateString();

  card.innerHTML = `
    <div class="relative mb-4">
      <img
        src="${imageUrl}"
        alt="${win.media?.[0]?.alt || win.title}"
        class="w-full h-48 object-cover rounded-lg"
        onerror="this.src='/img/placeholder.jpg'"
      />
      <div class="absolute top-2 right-2 bg-forest-green text-white px-2 py-1 rounded text-sm font-bold">
        WON
      </div>
    </div>

    <div class="flex-1 flex flex-col">
      <h2 class="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">${win.title}</h2>

      <div class="flex-1 mb-3">
        <p class="text-gray-600 text-lg line-clamp-3">${win.description || "No description available"}</p>
      </div>

      <div class="mb-3">
        <div class="flex justify-between items-center">
          <div>
            <p class="text-lg font-bold text-forest-green">
              Won for: ${winningBid} credits
            </p>
            <p class="text-sm text-gray-600">
              Ended: ${endDate}
            </p>
          </div>
        </div>
      </div>

      <div class="flex flex-wrap gap-1">
        ${
          win.tags
            ?.slice(0, 2)
            .map(
              (tag) =>
                `<span class="bg-super-soft-yellow text-black px-3 py-1 rounded text-md">${tag}</span>`,
            )
            .join("") || ""
        }
      </div>
    </div>

    <div class="flex gap-2 mt-4">
      <a
        href="/pages/item.html?id=${win.id}"
        class="flex-1 bg-forest-green text-earthy-beige px-4 py-2 rounded hover:bg-soft-teal-2 transition-colors text-center inline-block"
      >
        View Details
      </a>
    </div>
  `;

  return card;
}