import { BASE_URL } from "/js/constants/baseUrl.mjs";

export const AUTH_ENDPOINTS = {
  register: `${BASE_URL}auth/register`,
  login: `${BASE_URL}auth/login`,
  auctionListings: `${BASE_URL}auction/listings`,
  searchListings: `${BASE_URL}auction/listings/search`,
  profiles: `${BASE_URL}auction/profiles`,
};
