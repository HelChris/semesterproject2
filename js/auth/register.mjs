import { AUTH_ENDPOINTS } from "/js/constants/endpoints.mjs";
import { addToLocalStorage } from "/js/utils/local-storage.mjs";

export async function register(user) {
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  };

  const response = await fetch(AUTH_ENDPOINTS.register, options);
  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.errors?.[0]?.message || "Oh no, registration failed");
  }

  const { accessToken, name, email } = json.data;
  addToLocalStorage("accessToken", accessToken);
  addToLocalStorage("username", name);
  addToLocalStorage("email", email);

  return json;
}
