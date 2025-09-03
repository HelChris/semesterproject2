import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";
import { fileURLToPath } from "url";

const rootDir = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(rootDir, "index.html"),
        about: resolve(rootDir, "pages/about.html"),
        contact: resolve(rootDir, "pages/contact.html"),
        createListing: resolve(rootDir, "pages/create-listing.html"),
        editProfile: resolve(rootDir, "pages/edit-profile.html"),
        faq: resolve(rootDir, "pages/faq.html"),
        item: resolve(rootDir, "pages/item.html"),
        listings: resolve(rootDir, "pages/listings.html"),
        login: resolve(rootDir, "pages/login.html"),
        privacy: resolve(rootDir, "pages/privacy.html"),
        profile: resolve(rootDir, "pages/profile.html"),
        register: resolve(rootDir, "pages/register.html"),
        terms: resolve(rootDir, "pages/terms.html"),
      },
    },
  },
});
