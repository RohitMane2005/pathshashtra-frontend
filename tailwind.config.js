/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0A0A0F",
        bg2: "#111118",
        bg3: "#1A1A24",
        accent: "#FF6B00",
        accent2: "#00D4C8",
        accent3: "#9B6DFF",
        muted: "#7A7890",
      },
      fontFamily: {
        display: ["Bricolage Grotesque", "sans-serif"],
        sans: ["DM Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};
