/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./**/*.{html,js}", "!./node_modules/**/*"],
  theme: {
    extend: {
      backgroundImage: {
        sky: "url('./assets/images/example.jpg')",
      },
    },
  },
  plugins: [],
};
