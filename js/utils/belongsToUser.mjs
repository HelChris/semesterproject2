import { getFromLocalStorage } from "./localStorage.mjs";
/**
 * Checks if the current logged-in user is the author of a post
 *
 * @param {string} authorName - The name of the post author to check against
 * @returns {boolean} True if the current user is the author, false otherwise
 *
 * @example
 * // Check if the current user is the author of a post
 * const post = {
 *   title: "My Post",
 *   author: { name: "john_doe" }
 * };
 *
 * if (doesPostBelongToUser(post.author.name)) {
 *   console.log("This is your post - you can edit or delete it");
 *   showEditButtons();
 * } else {
 *   console.log("This post belongs to someone else");
 *   hideEditButtons();
 * }
 */
export function doesPostBelongToUser(authorName) {
  const username = getFromLocalStorage("username");

  if (authorName === username) {
    return true;
  }
  return false;
}
