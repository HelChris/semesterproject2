import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";

export default defineConfig([
  { files: ["**/*.{js,mjs,cjs}"] },
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        describe: true, // Used for grouping tests
        test: true, // Used to create tests
        it: true, // Alternative way to create tests
        expect: true, // Used for test assertions
        require: true, // Used in Node.js files like Tailwind config
        module: true, // Used in Node.js files like Tailwind config
        process: true, // Used for environment variables later,
        global: true, //used for something something
      },
    },
  },
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
  },
  {
    files: ["**/tailwind.config.js", "**/*.config.js"],
    languageOptions: {
      globals: {
        ...globals.node,
        module: "writable",
      },
    },
  },
]);
