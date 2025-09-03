/**
 * Category definitions with associated keywords
 */
export const CATEGORIES = {
  "magical-items": {
    name: "Magical Items",
    keywords: [
      "magic",
      "magical",
      "enchanted",
      "spell",
      "potion",
      "crystal",
      "wand",
      "charm",
      "mystical",
      "supernatural",
    ],
    icon: "✨",
  },
  "rare-collectibles": {
    name: "Rare Collectibles",
    keywords: [
      "rare",
      "collectible",
      "vintage",
      "antique",
      "limited",
      "unique",
      "precious",
      "valuable",
      "collector",
    ],
    icon: "💎",
  },
  "ancient-books": {
    name: "Ancient Books",
    keywords: [
      "book",
      "tome",
      "manuscript",
      "scroll",
      "grimoire",
      "ancient",
      "old",
      "text",
      "writing",
      "literature",
    ],
    icon: "📚",
  },
  "forest-artifacts": {
    name: "Forest Artifacts",
    keywords: [
      "forest",
      "nature",
      "wood",
      "tree",
      "leaf",
      "branch",
      "natural",
      "woodland",
      "botanical",
      "organic",
    ],
    icon: "🌲",
  },
};

/**
 * Categorizes a listing based on its tags and content
 * @param {Object} listing - The listing object
 * @returns {string} Category key or 'other' if no match
 */
export function categorizeListling(listing) {
  const searchText = [
    listing.title || "",
    listing.description || "",
    ...(listing.tags || []),
  ]
    .join(" ")
    .toLowerCase();

  for (const [categoryKey, category] of Object.entries(CATEGORIES)) {
    if (category.keywords.some((keyword) => searchText.includes(keyword))) {
      return categoryKey;
    }
  }

  return "other";
}

/**
 * Groups listings by category
 * @param {Array} listings - Array of listing objects
 * @returns {Object} Object with category keys and arrays of listings
 */
export function groupByCategory(listings) {
  const grouped = {
    "magical-items": [],
    "rare-collectibles": [],
    "ancient-books": [],
    "forest-artifacts": [],
    other: [],
  };

  listings.forEach((listing) => {
    const category = categorizeListling(listing);
    grouped[category].push(listing);
  });

  return grouped;
}

/**
 * Filters listings by category
 * @param {Array} listings - Array of listing objects
 * @param {string} categoryKey - Category to filter by
 * @returns {Array} Filtered listings array
 */
export function filterByCategory(listings, categoryKey) {
  if (!categoryKey || categoryKey === "all") {
    return listings;
  }

  return listings.filter(
    (listing) => categorizeListling(listing) === categoryKey,
  );
}
