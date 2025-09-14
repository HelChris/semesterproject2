/**
 * @fileoverview Auction Listings API Module
 *
 * This module provides functions for interacting with auction listings,
 * including fetching, creating, updating, deleting listings, and managing bids.
 * All functions use the Noroff Auction API with proper authentication and error handling.
 *
 */
import { AUTH_ENDPOINTS } from "/js/constants/endpoints.mjs";
import { getFromLocalStorage } from "/js/utils/local-storage.mjs";
import { API_KEY } from "/js/constants/apikey.mjs";
/**
 * Fetches paginated auction listings with optional sorting
 *
 * @async
 * @function fetchAuctionListings
 * @param {number} [limit=12] - Maximum number of listings to return per page
 * @param {number} [page=1] - Page number for pagination (1-based)
 * @param {string} [sortBy="created"] - Field to sort by (created, updated, endsAt)
 * @param {string} [sortOrder="desc"] - Sort order (asc or desc)
 * @returns {Promise<Object>} API response containing listings array and pagination metadata
 * @throws {Error} Throws error if API request fails or returns error response
 *
 * @example
 * // Fetch first page of latest listings
 * const response = await fetchAuctionListings();
 * console.log(response.data); // Array of listings
 *
 * @example
 * // Fetch second page with 6 items, sorted by end date
 * const response = await fetchAuctionListings(6, 2, "endsAt", "asc");
 */
export async function fetchAuctionListings(
  limit = 12,
  page = 1,
  sortBy = "created",
  sortOrder = "desc",
) {
  const url = `${AUTH_ENDPOINTS.auctionListings}?limit=${limit}&page=${page}&_bids=true&_seller=true&sort=${sortBy}&sortOrder=${sortOrder}`;

  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-Noroff-API-Key": API_KEY,
    },
  };

  const response = await fetch(url, options);
  const json = await response.json();

  if (!response.ok) {
    throw new Error(
      json.errors?.[0]?.message || "Failed to fetch auction listings",
    );
  }
  return json;
}
/**
 * Fetches a single auction listing by its ID
 *
 * @async
 * @function fetchAuctionById
 * @param {string} id - The unique ID of the auction listing
 * @returns {Promise<Object>} Single auction listing data with bids and seller information
 * @throws {Error} Throws error if listing not found or API request fails
 *
 * @example
 * try {
 *   const listing = await fetchAuctionById("550e8400-e29b-41d4-a716-446655440000");
 *   console.log(listing.title, listing.bids.length);
 * } catch (error) {
 *   console.error("Listing not found:", error.message);
 * }
 */
export async function fetchAuctionById(id) {
  const url = `${AUTH_ENDPOINTS.auctionListings}/${id}?_bids=true&_seller=true`;

  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-Noroff-API-Key": API_KEY,
    },
  };

  try {
    const response = await fetch(url, options);
    const json = await response.json();

    if (!response.ok) {
      throw new Error(
        json.errors?.[0]?.message || "Failed to fetch auction listing",
      );
    }
    return json.data;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error(
        "Network error: Unable to fetch auction listing. Check your internet connection",
      );
    }
    throw error;
  }
}
/**
 * Fetches auction listings created by a specific user
 *
 * @async
 * @function fetchListingsByUser
 * @param {string} username - The username of the seller
 * @param {number} [limit=12] - Maximum number of listings to return per page
 * @param {number} [page=1] - Page number for pagination (1-based)
 * @returns {Promise<Object>} API response containing user's listings and pagination metadata
 * @throws {Error} Throws error if user not found or API request fails
 *
 * @example
 * // Fetch all listings by user "john_doe"
 * const userListings = await fetchListingsByUser("john_doe");
 * console.log(`${userListings.data.length} listings found`);
 */
export async function fetchListingsByUser(username, limit = 12, page = 1) {
  const accessToken = getFromLocalStorage("accessToken");

  const url = `${AUTH_ENDPOINTS.profiles}/${username}/listings?limit=${limit}&page=${page}&_bids=true&sort=created&sortOrder=desc`;

  const headers = {
    "Content-Type": "application/json",
    "X-Noroff-API-Key": API_KEY,
  };

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const options = {
    method: "GET",
    headers,
  };

  const response = await fetch(url, options);
  const json = await response.json();

  if (!response.ok) {
    throw new Error(
      json.errors?.[0]?.message || "Failed to fetch user listings",
    );
  }
  return json;
}
/**
 * Fetches the most recent auction listings with optional filtering
 *
 * @async
 * @function fetchLatestListings
 * @param {number} [limit=12] - Maximum number of listings to return per page
 * @param {number} [page=1] - Page number for pagination (1-based)
 * @param {Object} [filters={}] - Optional filters to apply
 * @param {string} [filters.tag] - Filter by tag name
 * @param {boolean} [filters.active] - Filter by active status (true for active, false for ended)
 * @returns {Promise<Object>} API response containing filtered latest listings
 * @throws {Error} Throws error if API request fails
 *
 * @example
 * // Fetch latest active electronics listings
 * const response = await fetchLatestListings(10, 1, {
 *   tag: "electronics",
 *   active: true
 * });
 */
export async function fetchLatestListings(limit = 12, page = 1, filters = {}) {
  let url = `${AUTH_ENDPOINTS.auctionListings}?limit=${limit}&page=${page}&_bids=true&_seller=true&sort=created&sortOrder=desc`;

  if (filters.tag) {
    url += `&_tag=${encodeURIComponent(filters.tag)}`;
  }

  if (filters.active !== undefined) {
    url += `&_active=${filters.active}`;
  }

  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-Noroff-API-Key": API_KEY,
    },
  };

  const response = await fetch(url, options);
  const json = await response.json();

  if (!response.ok) {
    throw new Error(
      json.errors?.[0]?.message || "Failed to fetch latest listings",
    );
  }
  return json;
}
/**
 * Creates a new auction listing
 *
 * @async
 * @function createAuctionListing
 * @param {Object} listingData - The listing data to create
 * @param {string} listingData.title - Title of the listing
 * @param {string} listingData.description - Description of the item
 * @param {Array<Object>} [listingData.media] - Array of media objects with url and alt properties
 * @param {Array<string>} [listingData.tags] - Array of tag strings
 * @param {string} listingData.endsAt - ISO 8601 date string for auction end time
 * @returns {Promise<Object>} Created listing data
 * @throws {Error} Throws error if user not authenticated or creation fails
 *
 * @example
 * const newListing = {
 *   title: "Vintage Camera",
 *   description: "A beautiful vintage camera in excellent condition",
 *   media: [{ url: "https://example.com/image.jpg", alt: "Camera photo" }],
 *   tags: ["vintage", "camera", "photography"],
 *   endsAt: "2024-12-31T23:59:59.000Z"
 * };
 *
 * try {
 *   const result = await createAuctionListing(newListing);
 *   console.log("Listing created:", result.data.id);
 * } catch (error) {
 *   console.error("Failed to create listing:", error.message);
 * }
 */
export async function createAuctionListing(listingData) {
  const accessToken = getFromLocalStorage("accessToken");

  if (!accessToken) {
    throw new Error("You must be logged in to create a listing");
  }

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      "X-Noroff-API-Key": API_KEY,
    },
    body: JSON.stringify(listingData),
  };

  const response = await fetch(AUTH_ENDPOINTS.auctionListings, options);
  const json = await response.json();

  if (!response.ok) {
    throw new Error(
      json.errors?.[0]?.message || "Failed to create auction listing",
    );
  }

  return json;
}
/**
 * Searches auction listings by query string
 *
 * @async
 * @function searchAuctionListings
 * @param {string} query - Search query string to match against title and description
 * @param {number} [limit=12] - Maximum number of results to return per page
 * @param {number} [page=1] - Page number for pagination (1-based)
 * @returns {Promise<Object>} API response containing matching listings
 * @throws {Error} Throws error if search fails
 *
 * @example
 * // Search for camera listings
 * const results = await searchAuctionListings("vintage camera", 5, 1);
 * console.log(`Found ${results.data.length} camera listings`);
 */
export async function searchAuctionListings(query, limit = 12, page = 1) {
  const url = `${AUTH_ENDPOINTS.searchListings}?q=${encodeURIComponent(query)}&limit=${limit}&page=${page}&_bids=true&_seller=true`;

  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-Noroff-API-Key": API_KEY,
    },
  };

  const response = await fetch(url, options);
  const json = await response.json();

  if (!response.ok) {
    throw new Error(
      json.errors?.[0]?.message || "Failed to search auction listings",
    );
  }

  return json;
}

export async function placeBidOnListing(listingId, amount) {
  const authToken = getFromLocalStorage("accessToken");

  if (!authToken) {
    throw new Error("You must be logged in to place a bid");
  }
  if (!listingId) {
    throw new Error("Listing ID is required");
  }
  if (!amount || amount <= 0) {
    throw new Error("Bid amount must be greater than zero");
  }
  try {
    const url = `${AUTH_ENDPOINTS.auctionListings}/${listingId}/bids`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
        "X-Noroff-API-Key": API_KEY,
      },
      body: JSON.stringify({ amount: parseInt(amount) }),
    });

    if (!response.ok) {
      const errorData = await response.json();

      if (response.status === 400) {
        throw new Error(
          errorData.errors?.[0]?.message ||
          "Invalid bid amount or auction has ended",
        );
      }
      if (response.status === 401) {
        throw new Error("Authentication failed. Please log in again");
      }
      if (response.status === 403) {
        throw new Error("You cannot bid on this auction");
      }
      if (response.status === 404) {
        throw new Error("Auction not found");
      }

      throw new Error(
        errorData.errors?.[0]?.message ||
        `Bid failed: ${response.status} ${response.statusText}`,
      );
    }

    const result = await response.json();

    if (!result.data) {
      throw new Error("Invalid response from server");
    }

    return result.data;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error("Network error: Unable to place bid. Check your internet connection");
    }
    throw error;
  }
}

/**
 * Update an auction listing
 * @param {string} listingId - The ID of the listing to update
 * @param {Object} updateData - The data to update
 * @returns {Promise<Object>} Updated listing data
 */
export async function updateAuctionListing(listingId, updateData) {
  const accessToken = getFromLocalStorage("accessToken");

  if (!accessToken) {
    throw new Error("You must be logged in to update a listing");
  }

  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      "X-Noroff-API-Key": API_KEY,
    },
    body: JSON.stringify(updateData),
  };

  const response = await fetch(
    `${AUTH_ENDPOINTS.auctionListings}/${listingId}`,
    options,
  );
  const json = await response.json();

  if (!response.ok) {
    throw new Error(
      json.errors?.[0]?.message || "Failed to update auction listing",
    );
  }

  return json;
}

/**
 * Delete an auction listing
 * @param {string} listingId - The ID of the listing to delete
 * @returns {Promise<void>}
 */
export async function deleteAuctionListing(listingId) {
  const accessToken = getFromLocalStorage("accessToken");

  if (!accessToken) {
    throw new Error("You must be logged in to delete a listing");
  }

  const options = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      "X-Noroff-API-Key": API_KEY,
    },
  };

  const response = await fetch(
    `${AUTH_ENDPOINTS.auctionListings}/${listingId}`,
    options,
  );

  if (!response.ok) {
    const json = await response.json();
    throw new Error(
      json.errors?.[0]?.message || "Failed to delete auction listing",
    );
  }

  return;
}

/**
 * Fetch user's active bids
 * @param {string} username - The username
 * @param {number} limit - Number of items per page
 * @param {number} page - Page number
 * @returns {Promise<Object>} API response with user's bids
 */
export async function fetchUserBids(username, limit = 12, page = 1) {
  const accessToken = getFromLocalStorage("accessToken");

  if (!accessToken) {
    throw new Error("You must be logged in to view bids");
  }

  const url = `${AUTH_ENDPOINTS.profiles}/${username}/bids?limit=${limit}&page=${page}&_listings=true&_seller=true`;

  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      "X-Noroff-API-Key": API_KEY,
    },
  };

  const response = await fetch(url, options);
  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.errors?.[0]?.message || "Failed to fetch user bids");
  }

  return json;
}

/**
 * Fetch user's auction wins
 * @param {string} username - The username
 * @param {number} limit - Number of items per page
 * @param {number} page - Page number
 * @returns {Promise<Object>} API response with user's wins
 */
export async function fetchUserWins(username, limit = 12, page = 1) {
  const accessToken = getFromLocalStorage("accessToken");

  if (!accessToken) {
    throw new Error("You must be logged in to view wins");
  }

  const url = `${AUTH_ENDPOINTS.profiles}/${username}/wins?limit=${limit}&page=${page}&_bids=true&_seller=true`;

  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      "X-Noroff-API-Key": API_KEY,
    },
  };

  const response = await fetch(url, options);
  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.errors?.[0]?.message || "Failed to fetch user wins");
  }

  return json;
}
