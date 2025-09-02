import { getFromLocalStorage } from "./localStorage.mjs";

export function getCurrentUsername() {
  return getFromLocalStorage("username") || null;
}
