import { getFromLocalStorage } from "/js/utils/localStorage.mjs";
import { AUTH_ENDPOINTS } from "/js/constants/endpoints.mjs";
import { API_KEY } from "/js/constants/apiKey.mjs";

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

    if (!response.ok) {
      console.error(
        "Failed to fetch profile:",
        response.status,
        response.statusText,
      );
      return;
    }

    const data = await response.json();
    const avatarUrl =
      data.data?.avatar?.url || "/assets/img/avatar-placeholder.jpg";

    // Update all elements with id="profile-avatar" (if you have more than one)
    document.querySelectorAll("#profile-avatar").forEach((img) => {
      img.src = avatarUrl;
    });

    // Update hidden avatar input for edit profile form
    const avatarInput = document.getElementById("avatar-url");
    if (avatarInput && data.data?.avatar?.url) {
      avatarInput.value = data.data.avatar.url;
    }

    // Optionally update other profile info here (e.g., username, bio, etc.)
    // Example:
    // const usernameElem = document.getElementById("profile-username");
    // if (usernameElem) usernameElem.textContent = data.name;

    console.log("Profile loaded, avatar URL:", avatarUrl);
  } catch (error) {
    console.error("Error loading user profile:", error);
    // Optionally show a message to the
  }
}
