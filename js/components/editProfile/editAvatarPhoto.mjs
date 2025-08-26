import { getFromLocalStorage } from "/js/utils/localStorage.mjs";
import { AUTH_ENDPOINTS } from "/js/constants/endpoints.mjs";
import { API_KEY } from "../../constants/apiKey.mjs";

export async function updateAvatar(newAvatarUrl) {
  const username = getFromLocalStorage("username");
  const accessToken = getFromLocalStorage("accessToken");

  const url = `${AUTH_ENDPOINTS.profiles}/${username}`;
  const body = {
    avatar: {
      url: newAvatarUrl,
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

  // Debug logs
  console.log("Request URL:", url);
  console.log("Request Headers:", options.headers);
  console.log("Request Body:", options.body);

  const response = await fetch(url, options);

  let json = null;
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    json = await response.json();
  } else {
    const text = await response.text();
    if (text) {
      console.error("Non-JSON error response:", text);
    }
  }

  if (!response.ok) {
    console.error("Avatar update failed:", response.status, json);
    throw new Error(
      json?.errors?.[0]?.message ||
        `Failed to update avatar (status ${response.status})`,
    );
  }

  return json;
}
