/**
 * @fileoverview Category Classification and Mapping Module
 *
 * This module provides intelligent categorization functionality for auction listings
 * based on content analysis of titles, tags, and keywords. Implements a multi-tier
 * matching system with exact tag matching and title keyword detection to automatically
 * classify listings into predefined categories.
 *
 * Features:
 * - Predefined category system with keyword mapping
 * - Multi-tier matching: exact tag matches (priority) + title keyword matching
 * - Word boundary regex matching for accurate keyword detection
 * - Batch listing categorization and filtering utilities
 * - Debug utilities for understanding categorization decisions
 * - Graceful handling of malformed or missing data
 * - Case-insensitive matching with normalization
 *
 * Classification Strategy:
 * 1. Exact tag matches (highest priority) - looks for keywords in listing tags
 * 2. Title keyword matches (secondary) - scans title for category keywords
 * 3. Fallback to "other" category when no matches found
 *
 * Categories:
 * - magical-items: Magic, enchanted, mystical items
 * - rare-collectibles: Vintage, antique, limited edition items
 * - ancient-books: Books, manuscripts, texts, grimoires
 * - forest-artifacts: Natural, woodland, botanical items
 * - other: Uncategorized listings
 *
 * Dependencies:
 * - None (self-contained utility module)
 *
 * Usage Patterns:
 * - Use categorizeListling() for single item classification
 * - Use filterByCategory() for category-based filtering
 * - Use groupByCategory() for organizing listings by category
 * - Use debugCategorization() for troubleshooting classification
 *
 * Performance Notes:
 * - Uses efficient regex word boundary matching
 * - Early return on first category match for optimization
 * - Handles arrays gracefully with validation checks
 *
 */

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
