import { getFromLocalStorage } from "/js/utils/local-storage.mjs";
import { AUTH_ENDPOINTS } from "/js/constants/endpoints.mjs";
import { API_KEY } from "/js/constants/apikey.mjs";

export async function updateAvatar(newAvatarUrl) {
  const username = getFromLocalStorage("username");
  const accessToken = getFromLocalStorage("accessToken");

  const url = `${AUTH_ENDPOINTS.profiles}/${username}`;
  const body = {
    avatar: {
      url: newAvatarUrl,
      alt: "Avatar image",
    },
  };

  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      "X-Noroff-API-Key": API_KEY,
    },
    body: JSON.stringify(body),
  };

  const response = await fetch(url, options);

  let json = null;
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    json = await response.json();
  } else {
    await response.text();
  }

  if (!response.ok) {
    throw new Error(
      json?.errors?.[0]?.message ||
        `Failed to update avatar (status ${response.status})`,
    );
  }

  return json;
}
