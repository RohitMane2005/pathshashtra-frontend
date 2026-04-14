/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#09090b",
        bg2: "#0f0f12",
        bg3: "#18181b",
        accent: "#f59e0b",
        accent2: "#10b981",
        accent3: "#8b5cf6",
        muted: "#a1a1aa",
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
