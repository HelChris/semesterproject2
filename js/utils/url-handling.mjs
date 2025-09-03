/**
 * Generates a URL-friendly slug from a post title
 *
 * @param {string} title - The title to convert to a slug
 * @returns {string} A URL-friendly slug version of the title
 *
 * @example
 * // Generate a slug from a title
 * const slug = generateSlug("My Awesome Post Title!");
 * console.log(slug); // "my-awesome-post-title"
 */
export function generateSlug(title) {
  if (!title) return "";

  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

/**
 * Creates a formatted URL for a post using its ID and title
 *
 * @param {string} id - The unique identifier of the post
 * @param {string} title - The title of the post
 * @returns {string} A formatted URL string for the post page
 *
 * @example
 * // Create a URL for a post
 * const postUrl = createPostUrl("123abc", "My First Blog Post");
 * console.log(postUrl); // "/feed/post.html?id=123abc&title=my-first-blog-post"
 */
export function createPostUrl(id, title) {
  const slug = generateSlug(title);
  return `/feed/post.html?id=${id}&title=${slug}`;
}

/**
 * Extracts the post ID from the current URL
 *
 * @returns {string|null} The post ID if found in the URL, otherwise null
 *
 * @example
 * // Assuming URL is "/feed/post.html?id=123abc&title=my-post"
 * const postId = getPostIdFromUrl();
 * console.log(postId); // "123abc"
 */
export function getPostIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("id");
}

/**
 * Updates the browser URL with post ID and title without reloading the page
 *
 * @param {string} id - The unique identifier of the post
 * @param {string} title - The title of the post
 * @returns {void}
 *
 * @example
 * // Update the URL with a post's information
 * updateUrlWithTitle("456def", "Updated Post Title");
 * // URL will change to "/feed/post.html?id=456def&title=updated-post-title"
 */
export function updateUrlWithTitle(id, title) {
  const newUrl = createPostUrl(id, title);

  window.history.pushState({ id, title }, title, newUrl);
}
