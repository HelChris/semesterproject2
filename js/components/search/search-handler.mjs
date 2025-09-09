export function setupGlobalSearch() {
  const searchInput = document.querySelector("#site-search");
  const searchButton = document.querySelector("#search-button");

  if (!searchInput || !searchButton) {
    return;
  }
git 

  const handleGlobalSearch = async (query) => {
    if (!query.trim()) {
      sessionStorage.removeItem("searchQuery");
      sessionStorage.removeItem("searchResults");
      window.location.href = "/pages/listings.html";
      return;
    }

    try {
      const searchResults = await performEnhancedSearch(query.trim());

      sessionStorage.setItem("searchQuery", query.trim());
      sessionStorage.setItem("searchResults", JSON.stringify(searchResults));

      window.location.href = "/pages/listings.html";
    } catch (error) {
      console.error("Enhanced search failed:", error);
      // Fallback: store just the query and let listings page handle the search
      sessionStorage.setItem("searchQuery", query.trim());
      sessionStorage.removeItem("searchResults");
      window.location.href = "/pages/listings.html";
    }
  };

  searchButton.addEventListener("click", () => {
    handleGlobalSearch(searchInput.value);
  });

  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      handleGlobalSearch(searchInput.value);
    }
  });
}

async function performEnhancedSearch(query) {
  const { API_KEY } = await import("/js/constants/apikey.mjs");
  const limit = 12;
  const page = 1;

  try {
    // Make both searches simultaneously
    const [contentResults, userResults] = await Promise.allSettled([
      searchListingsByContent(query, limit, page, API_KEY),
      searchListingsByUser(query, limit, page, API_KEY),
    ]);

    // Log individual results
    if (contentResults.status === "fulfilled") {
      console.log(
        `Content search: ${contentResults.value.data?.length || 0} results`,
      );
    } else {
      console.warn("📄 Content search failed:", contentResults.reason?.message);
    }

    if (userResults.status === "fulfilled") {
      console.log(
        `User search: ${userResults.value.data?.length || 0} results`,
      );
    } else {
      console.warn("User search failed:", userResults.reason?.message);
    }

    const combinedResults = combineSearchResults(
      contentResults.status === "fulfilled"
        ? contentResults.value
        : { data: [] },
      userResults.status === "fulfilled" ? userResults.value : { data: [] },
      limit,
    );

    return combinedResults;
  } catch (error) {
    console.error("Enhanced search failed completely:", error);
    throw error;
  }
}

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

async function searchListingsByUser(query, limit, page, apiKey) {
  const { AUTH_ENDPOINTS } = await import("/js/constants/endpoints.mjs");
  const { getFromLocalStorage } = await import("/js/utils/local-storage.mjs");

  try {
    // Get auth token
    const authToken = getFromLocalStorage("accessToken");
    if (!authToken) {
      return { data: [], meta: {} };
    }

    // Try case variations for exact username match
    const caseVariations = [
      query,
      query.toLowerCase(),
      query.toUpperCase(),
      query.charAt(0).toUpperCase() + query.slice(1).toLowerCase(),
    ];

    // Remove duplicates from variations
    const uniqueVariations = [...new Set(caseVariations)];

    // Try each case variation
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

      if (response.status === 404) {
        console.log(`Username variation "${variation}" not found`);
        continue;
      }

      console.warn(`User search error for "${variation}": ${response.status}`);
    }

    return { data: [], meta: {} };
  } catch (error) {
    console.warn("👤 User search failed:", error.message);
    return { data: [], meta: {} };
  }
}

/**
 * Combine and deduplicate search results from content and user searches
 */
function combineSearchResults(contentResults, userResults, limit) {
  const contentListings = contentResults.data || [];
  const userListings = userResults.data || [];

  // Create a Map to deduplicate by listing ID
  const uniqueListings = new Map();

  // Add content search results first (higher priority)
  contentListings.forEach((listing) => {
    if (listing && listing.id) {
      uniqueListings.set(listing.id, {
        ...listing,
        searchMatchType: "content",
      });
    }
  });

  // Add user search results (avoid duplicates)
  userListings.forEach((listing) => {
    if (listing && listing.id && !uniqueListings.has(listing.id)) {
      uniqueListings.set(listing.id, {
        ...listing,
        searchMatchType: "user",
      });
    }
  });

  // Convert back to array and limit results
  const combinedListings = Array.from(uniqueListings.values()).slice(0, limit);

  // Sort by relevance: content matches first, then by creation date
  combinedListings.sort((a, b) => {
    if (a.searchMatchType === "content" && b.searchMatchType === "user")
      return -1;
    if (a.searchMatchType === "user" && b.searchMatchType === "content")
      return 1;
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
    },
  };
}
