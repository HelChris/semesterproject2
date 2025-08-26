import { getFromLocalStorage } from "/js/utils/localStorage.mjs";
import { AUTH_ENDPOINTS } from "/js/constants/endpoints.mjs";
import { API_KEY } from "/js/constants/apiKey.mjs";
import { showError } from "/js/shared/errorHandling.mjs";
import { loadUserProfile } from "/js/components/userProfile/loadUserProfile.mjs";

export function setupEditProfileForm() {
  const form = document.getElementById("editProfile-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Get only the fields you want to send
    const avatarUrl = document.getElementById("avatar-url")?.value.trim();
    const bannerUrl = document.getElementById("banner-url")?.value.trim();
    const bio = document.getElementById("bio")?.value.trim();

    // Optionally, get alt text or set a default
    const avatarAlt = "Avatar image";
    const bannerAlt = "Banner image";

    const username = getFromLocalStorage("username");
    const accessToken = getFromLocalStorage("accessToken");

    const url = `${AUTH_ENDPOINTS.profiles}/${username}`;
    const body = {
      avatar: {
        url: avatarUrl,
        alt: avatarAlt,
      },
      banner: {
        url: bannerUrl,
        alt: bannerAlt,
      },
      bio: bio,
    };

    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          "X-Noroff-API-Key": API_KEY,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.errors?.[0]?.message || "Failed to update profile",
        );
      }

      await loadUserProfile();

      const messageDiv = document.getElementById("message");
      if (messageDiv) {
        messageDiv.textContent = "Profile updated successfully!";
      }

      form.reset();
    } catch (error) {
      showError(error.message, "#message");
    }
  });
}
