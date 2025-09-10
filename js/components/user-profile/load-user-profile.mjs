import { getFromLocalStorage } from "/js/utils/local-storage.mjs";
import { AUTH_ENDPOINTS } from "/js/constants/endpoints.mjs";
import { API_KEY } from "/js/constants/apikey.mjs";

export async function loadUserProfile() {
  const username = getFromLocalStorage("username");
  const accessToken = getFromLocalStorage("accessToken");

  const url = `${AUTH_ENDPOINTS.profiles}/${username}`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": API_KEY,
      },
    });

    const result = await response.json();
    const profileData = result.data;

    updateProfileAvatar(profileData);
    updateProfileInfo(profileData);
  } catch (error) {
    console.error("error loading user profile:", error);
  }
}

function updateProfileAvatar(profileData) {
  const avatarUrl = profileData?.avatar?.url || "/img/avatar-placeholder.jpg";

  const avatarElements = document.querySelectorAll(
    "#profile-avatar, .profile-avatar, img[alt*='profile'], img[alt*='avatar']",
  );

  avatarElements.forEach((img) => {
    img.src = avatarUrl;
    img.alt = `${profileData?.name || "User"}'s profile picture`;
  });

  const profilePageAvatar = document.querySelector(
    ".w-24.h-24.rounded-full, .w-20.h-20.rounded-full",
  );
  if (profilePageAvatar) {
    profilePageAvatar.src = avatarUrl;
    profilePageAvatar.alt = `${profileData?.name || "User"}'s profile picture}`;
    profilePageAvatar.onerror = () => {
      profilePageAvatar.src = "/img/avatar1-placeholder.jpg";
    };
  }
}

function updateProfileInfo(profileData) {
  const usernameElements = document.querySelectorAll(
    "#profile-username, .profile-username",
  );
  usernameElements.forEach((elem) => {
    if (elem) elem.textContent = profileData?.name || "Unknown User";
  });

  updateBio(profileData?.bio);
  updateCredits(profileData?.credits);
  updateListingsCount(profileData?._count?.listings);
}

function updateBio(bio) {
  const bioElement = document.getElementById("profile-bio");
  if (bioElement) {
    bioElement.textContent = bio || "No bio available";
  }

  const bioTextarea = document.getElementById("bio");
  if (bioTextarea) {
    bioTextarea.value = bio || "";
  }
}

function updateCredits(credits) {
  const creditsElement = document.getElementById("profile-credits");
  const creditAmount = credits !== undefined ? credits : 0;

  if (creditsElement) {
    creditsElement.textContent = `Credits: ${creditAmount}`;
  }
}

function updateListingsCount(listingsCount) {
  const listingsElement = document.getElementById("profile-listings-count");
  const count = listingsCount !== undefined ? listingsCount : 0;

  if (listingsElement) {
    listingsElement.textContent = `Listings: ${count}`;
  }
}
