import { AUTH_ENDPOINTS } from "/js/constants/endpoints.mjs";
import { getFromLocalStorage } from "/js/utils/localStorage.mjs";
import { API_KEY } from "/js/constants/apiKey.mjs";

/**
 * Fetches all auction listings from the API (limit 12, page 1)
 */

export async function fetchAuctionListings(limit = 12, page = 1) {
  const url = `${AUTH_ENDPOINTS.auctionListings}?limit=${limit}&page=${page}&_bids=true&_seller=true`;

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
 * Fetches a single auction listing by ID
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

  const response = await fetch(url, options);
  const json = await response.json();

  if (!response.ok) {
    throw new Error(
      json.errors?.[0]?.message || "Failed to fetch auction listing",
    );
  }

  return json;
}

/**
 * Creates a new auction Listing
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
 * Searches auction listings
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
