/**
 * @fileoverview Global Search Handler Module
 *
 * This module provides comprehensive search functionality for the auction platform,
 * including content-based search, user-based search, and combined result processing.
 * Handles both desktop and mobile search interfaces with proper error handling.
 *
 * Features:
 * - Dual search capability (content + user-based)
 * - Mobile and desktop interface support
 * - Result deduplication and prioritization
 * - Graceful error handling with user feedback
 * - Session storage for search persistence
 **/

/**
 * Sets up global search functionality for both desktop and mobile interfaces
 *
 * Initializes search input handlers, button click events, and mobile menu integration.
 * Handles search query processing, result storage, and navigation to results page.
 * Provides fallback behavior when search fails to ensure user can still browse listings.
 *
 * @function setupGlobalSearch
 * @returns {void}
 *
 * @example
 * // Initialize search functionality on page load
 * document.addEventListener('DOMContentLoaded', () => {
 *   setupGlobalSearch();
 * });
 *
 * @example
 * // Manual initialization after dynamic content load
 * setupGlobalSearch();
 */
export function setupGlobalSearch() {
  const searchInput = document.querySelector("#site-search");
  const searchButton = document.querySelector("#search-button");

  const mobileSearchInput = document.querySelector("#site-search-mobile");
  const mobileSearchButton = document.querySelector("#search-button-mobile");

  /**
   * Handles the global search process with enhanced error recovery
   *
   * Performs search query validation, executes enhanced search,
   * stores results in session storage, and navigates to results page.
   * Falls back to listings page on errors while preserving user query.
   *
   * @async
   * @function handleGlobalSearch
   * @param {string} query - The search query string
   * @returns {Promise<void>}
   *
   * @throws {Error} Logs search errors but provides graceful fallback
   */
  const handleGlobalSearch = async (query) => {
    // Handle empty query - redirect to all listings
    if (!query.trim()) {
      sessionStorage.removeItem("searchQuery");
      sessionStorage.removeItem("searchResults");
      window.location.href = "/pages/listings.html";
      return;
    }

    try {
      const searchResults = await performEnhancedSearch(query.trim());

      // Store successful search results
      sessionStorage.setItem("searchQuery", query.trim());
      sessionStorage.setItem("searchResults", JSON.stringify(searchResults));

      window.location.href = "/pages/listings.html";
    } catch {
      // Store query but remove stale results on error
      sessionStorage.setItem("searchQuery", query.trim());
      sessionStorage.removeItem("searchResults");

      // the listings page will handle the error display
      window.location.href = "/pages/listings.html";
    }
  };

  /**
   * Closes the mobile menu interface
   *
   * Handles mobile menu state management by adding transform classes
   * and restoring body scroll behavior.
   *
   * @function closeMobileMenu
   * @returns {void}
   */
  const closeMobileMenu = () => {
    const mobileMenu = document.getElementById("mobile-menu");
    if (mobileMenu) {
      mobileMenu.classList.add("translate-x-full");
      document.body.style.overflow = "";
    }
  };

  // Desktop search event listeners
  if (searchInput && searchButton) {
    searchButton.addEventListener("click", () => {
      handleGlobalSearch(searchInput.value);
    });

    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        handleGlobalSearch(searchInput.value);
      }
    });
  }

  // Mobile search event listeners
  if (mobileSearchInput && mobileSearchButton) {
    mobileSearchButton.addEventListener("click", () => {
      closeMobileMenu();
      handleGlobalSearch(mobileSearchInput.value);
    });

    mobileSearchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        closeMobileMenu();
        handleGlobalSearch(mobileSearchInput.value);
      }
    });
  }
}

/**
 * Performs enhanced search combining content and user-based searches
 *
 * Executes parallel searches for both listing content and user profiles,
 * then combines and deduplicates results. Handles partial failures gracefully
 * by returning available results from successful search types.
 *
 * @async
 * @function performEnhancedSearch
 * @param {string} query - The search query string
 * @returns {Promise<Object>} Combined search results object
 * @returns {Array} returns.data - Array of listing objects
 * @returns {Object} returns.meta - Metadata about search results
 *
 * @throws {Error} When both search methods fail completely
 *
 * @example
 * try {
 *   const results = await performEnhancedSearch('vintage camera');
 *   console.log(`Found ${results.data.length} listings`);
 * } catch (error) {
 *   showError(error, '#search-error-container');
 * }
 */
async function performEnhancedSearch(query) {
  const { API_KEY } = await import("/js/constants/apikey.mjs");
  const limit = 12;
  const page = 1;

  try {
    // Execute both searches simultaneously for better performance
    const [contentResults, userResults] = await Promise.allSettled([
      searchListingsByContent(query, limit, page, API_KEY),
      searchListingsByUser(query, limit, page, API_KEY),
    ]);

    // Process results - at least one search type should succeed for valid results
    const hasContentResults =
      contentResults.status === "fulfilled" && contentResults.value?.data;
    const hasUserResults =
      userResults.status === "fulfilled" && userResults.value?.data;

    // If both searches failed, throw error
    if (!hasContentResults && !hasUserResults) {
      throw new Error("Search temporarily unavailable. Please try again.");
    }

    const combinedResults = combineSearchResults(
      hasContentResults ? contentResults.value : { data: [] },
      hasUserResults ? userResults.value : { data: [] },
      limit,
    );

    return combinedResults;
  } catch (error) {
    throw new Error(`Search failed: ${error.message}`);
  }
}

/**
 * Searches listings by content (title, description, tags)
 *
 * Performs API call to search through listing content using the platform's
 * search endpoint. Includes seller information and bid data in results.
 *
 * @async
 * @function searchListingsByContent
 * @param {string} query - Search query string
 * @param {number} limit - Maximum number of results to return
 * @param {number} page - Page number for pagination
 * @param {string} apiKey - API key for authentication
 * @returns {Promise<Object>} API response object with listing data
 * @returns {Array} returns.data - Array of listing objects
 * @returns {Object} returns.meta - Pagination and result metadata
 *
 * @throws {Error} When API request fails or returns non-200 status
 *
 * @example
 * const results = await searchListingsByContent('camera', 10, 1, API_KEY);
 * const listings = results.data;
 */
async function searchListingsByContent(query, limit, page, apiKey) {
  const { AUTH_ENDPOINTS } = await import("/js/constants/endpoints.mjs");

  const url = `${AUTH_ENDPOINTS.searchListings}?q=${encodeURIComponent(query)}&limit=${limit}&page=${page}&_bids=true&_seller=true`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-Noroff-API-Key": apiKey,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Content search failed: ${response.status} ${response.statusText}`,
    );
  }

  return await response.json();
}

/**
 * Searches listings by username with case-insensitive matching
 *
 * Attempts to find listings by searching for exact username matches
 * using multiple case variations. Requires user authentication.
 * Returns empty results if user is not logged in.
 *
 * @async
 * @function searchListingsByUser
 * @param {string} query - Username to search for
 * @param {number} limit - Maximum number of results to return
 * @param {number} page - Page number for pagination
 * @param {string} apiKey - API key for authentication
 * @returns {Promise<Object>} Search results object
 * @returns {Array} returns.data - Array of matching user's listings
 * @returns {Object} returns.meta - Search metadata including match info
 *
 * @throws {Error} When authenticated request fails (non-404 errors)
 *
 * @example
 * // Search for listings by user 'johndoe'
 * const results = await searchListingsByUser('johndoe', 10, 1, API_KEY);
 * if (results.data.length > 0) {
 *   console.log(`Found ${results.data.length} listings by this user`);
 * }
 */
async function searchListingsByUser(query, limit, page, apiKey) {
  const { AUTH_ENDPOINTS } = await import("/js/constants/endpoints.mjs");
  const { getFromLocalStorage } = await import("/js/utils/local-storage.mjs");

  try {
    // Check authentication - return empty results if not logged in
    const authToken = getFromLocalStorage("accessToken");
    if (!authToken) {
      return { data: [], meta: {} };
    }

    // Generate case variations for username matching
    const caseVariations = [
      query,
      query.toLowerCase(),
      query.toUpperCase(),
      query.charAt(0).toUpperCase() + query.slice(1).toLowerCase(),
    ];

    // Remove duplicates from variations
    const uniqueVariations = [...new Set(caseVariations)];

    // Try each case variation until we find a match
    for (const variation of uniqueVariations) {
      const profileUrl = `${AUTH_ENDPOINTS.profiles}/${encodeURIComponent(variation)}/listings?limit=${limit}&page=${page}&_bids=true&_seller=true`;

      const response = await fetch(profileUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
          "X-Noroff-API-Key": apiKey,
        },
      });

      if (response.ok) {
        const result = await response.json();

        // Filter listings to ensure exact username match
        const filteredListings = result.data.filter((listing) => {
          if (!listing.seller?.name) return false;
          return listing.seller.name.toLowerCase() === query.toLowerCase();
        });

        return {
          data: filteredListings,
          meta: {
            ...result.meta,
            searchedUsername: variation,
            originalQuery: query,
            totalFound: result.data.length,
            filteredCount: filteredListings.length,
          },
        };
      }

      // 404 is expected when username doesn't exist - continue to next variation
      if (response.status === 404) {
        continue;
      }

      // Log other HTTP errors but continue searching
    }

    // No matching username found
    return { data: [], meta: {} };
  } catch {
    // Return empty results on error - don't break the combined search
    return { data: [], meta: {} };
  }
}

/**
 * Combines and deduplicates search results from multiple sources
 *
 * Merges content-based and user-based search results, removes duplicates
 * by listing ID, and applies intelligent sorting. Content matches are
 * prioritized over user matches, with secondary sorting by creation date.
 *
 * @function combineSearchResults
 * @param {Object} contentResults - Results from content-based search
 * @param {Array} contentResults.data - Array of listings from content search
 * @param {Object} userResults - Results from user-based search
 * @param {Array} userResults.data - Array of listings from user search
 * @param {number} limit - Maximum number of results to return
 * @returns {Object} Combined search results
 * @returns {Array} returns.data - Deduplicated and sorted listing array
 * @returns {Object} returns.meta - Combined metadata with match statistics
 *
 * @example
 * const contentResults = { data: [listing1, listing2] };
 * const userResults = { data: [listing2, listing3] };
 * const combined = combineSearchResults(contentResults, userResults, 10);
 * // Returns: { data: [listing1, listing2, listing3], meta: {...} }
 */
function combineSearchResults(contentResults, userResults, limit) {
  const contentListings = contentResults.data || [];
  const userListings = userResults.data || [];

  // Use Map for efficient deduplication by listing ID
  const uniqueListings = new Map();

  // Add content search results first (higher priority for relevance)
  contentListings.forEach((listing) => {
    if (listing && listing.id) {
      uniqueListings.set(listing.id, {
        ...listing,
        searchMatchType: "content",
      });
    }
  });

  // Add user search results (skip duplicates already in Map)
  userListings.forEach((listing) => {
    if (listing && listing.id && !uniqueListings.has(listing.id)) {
      uniqueListings.set(listing.id, {
        ...listing,
        searchMatchType: "user",
      });
    }
  });

  // Convert Map to array and apply result limit
  const combinedListings = Array.from(uniqueListings.values()).slice(0, limit);

  // Sort by relevance: content matches first, then by creation date (newest first)
  combinedListings.sort((a, b) => {
    // Prioritize content matches over user matches
    if (a.searchMatchType === "content" && b.searchMatchType === "user")
      return -1;
    if (a.searchMatchType === "user" && b.searchMatchType === "content")
      return 1;

    // Within same match type, sort by creation date (newest first)
    return new Date(b.created) - new Date(a.created);
  });

  return {
    data: combinedListings,
    meta: {
      totalResults: combinedListings.length,
      contentMatches: contentListings.length,
      userMatches: userListings.length,
      isFirstPage: true,
      isLastPage: combinedListings.length < limit,
      hasResults: combinedListings.length > 0,
    },
  };
}
