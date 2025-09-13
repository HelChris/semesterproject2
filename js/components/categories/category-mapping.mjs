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
  },
};

/**
 * Categorizes a listing based on exact tag matches and keyword matches in title
 * @param {Object} listing - The listing object
 * @returns {string} Category key or 'other' if no match
 */
export function categorizeListling(listing) {
  if (!listing) return "other";

  // Get tags and normalize them
  const tags = (listing.tags || []).map((tag) => tag.toLowerCase().trim());
  const title = (listing.title || "").toLowerCase();

  // Check each category
  for (const [categoryKey, category] of Object.entries(CATEGORIES)) {
    // 1. EXACT TAG MATCHES (highest priority)
    const hasExactTagMatch = tags.some((tag) =>
      category.keywords.some(
        (keyword) =>
          tag === keyword.toLowerCase() ||
          // Also check if tag contains keyword as whole word
          new RegExp(`\\b${keyword.toLowerCase()}\\b`).test(tag),
      ),
    );

    if (hasExactTagMatch) {
      return categoryKey;
    }

    // 2. KEYWORD MATCHES IN TITLE (second priority)
    const hasTitleMatch = category.keywords.some((keyword) => {
      const keywordLower = keyword.toLowerCase();
      // Use word boundary regex for exact word matching in title
      const wordBoundaryRegex = new RegExp(`\\b${keywordLower}\\b`, "i");
      return wordBoundaryRegex.test(title);
    });

    if (hasTitleMatch) {
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

  if (!Array.isArray(listings)) {
    console.warn("groupByCategory: listings is not an array");
    return grouped;
  }

  listings.forEach((listing) => {
    const category = categorizeListling(listing);
    grouped[category].push(listing);
  });

  return grouped;
}

/**
 * Filters listings by category with exact matching
 * @param {Array} listings - Array of listing objects
 * @param {string} categoryKey - Category to filter by
 * @returns {Array} Filtered listings array
 */
export function filterByCategory(listings, categoryKey) {
  if (!Array.isArray(listings)) {
    console.warn("filterByCategory: listings is not an array");
    return [];
  }

  if (!categoryKey || categoryKey === "all") {
    return listings;
  }

  return listings.filter((listing) => {
    const category = categorizeListling(listing);
    return category === categoryKey;
  });
}

/**
 * Debug function to understand why a listing was categorized a certain way
 * @param {Object} listing - The listing to debug
 * @returns {Object} Debug information
 */
export function debugCategorization(listing) {
  if (!listing) return { category: "other", reason: "No listing provided" };

  const tags = (listing.tags || []).map((tag) => tag.toLowerCase().trim());
  const title = (listing.title || "").toLowerCase();

  const debug = {
    listing: {
      title: listing.title,
      tags: listing.tags,
      description: listing.description?.substring(0, 100) + "...",
    },
    category: "other",
    reason: "No matches found",
    matches: [],
  };

  // Check each category for matches
  for (const [categoryKey, category] of Object.entries(CATEGORIES)) {
    const tagMatches = [];
    const titleMatches = [];

    // Check exact tag matches
    tags.forEach((tag) => {
      category.keywords.forEach((keyword) => {
        if (
          tag === keyword.toLowerCase() ||
          new RegExp(`\\b${keyword.toLowerCase()}\\b`).test(tag)
        ) {
          tagMatches.push({ tag, keyword, type: "exact_tag" });
        }
      });
    });

    // Check title matches
    category.keywords.forEach((keyword) => {
      const keywordLower = keyword.toLowerCase();
      const wordBoundaryRegex = new RegExp(`\\b${keywordLower}\\b`, "i");

      if (wordBoundaryRegex.test(title)) {
        titleMatches.push({ keyword, type: "title_word" });
      }
    });

    // If we found matches, this is the category
    if (tagMatches.length > 0 || titleMatches.length > 0) {
      debug.category = categoryKey;
      debug.reason = `Found ${tagMatches.length} tag matches and ${titleMatches.length} title matches`;
      debug.matches.push({
        category: categoryKey,
        tagMatches,
        titleMatches,
      });
      break; // Return first match (tags have priority)
    }
  }

  return debug;
}
