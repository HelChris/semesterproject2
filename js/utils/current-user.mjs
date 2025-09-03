import { getFromLocalStorage } from "./local-storage.mjs";

export function getCurrentUsername() {
  return getFromLocalStorage("username") || null;
}
