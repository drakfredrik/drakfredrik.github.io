/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{njk,html,md}",
    "./src/_includes/**/*.njk",
  ],
  theme: {
    extend: {
      colors: {
        navy: "#15192D",
        brand: {
          red: "#FF3B2F",
          beige: "#F5DDD0",
        },
      },
    },
  },
  plugins: [],
};
