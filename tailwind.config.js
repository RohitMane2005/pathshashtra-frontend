/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#070a12",
        bg2: "#0c101d",
        bg3: "#131a2e",
        surface: "rgba(15, 23, 42, 0.65)",
        surfaceHover: "rgba(30, 41, 59, 0.75)",
        primary: {
          DEFAULT: "#06b6d4",
          hover: "#22d3ee",
          glow: "rgba(6, 182, 212, 0.25)",
        },
        indigo: {
          accent: "#6366f1",
          hover: "#818cf8",
          glow: "rgba(99, 102, 241, 0.25)",
        },
        violet: {
          accent: "#8b5cf6",
          glow: "rgba(139, 92, 246, 0.25)",
        },
        cyan: "#06b6d4",
        teal: "#14b8a6",
        emerald: "#10b981",
        amber: "#f59e0b",
        rose: "#f43f5e",
        muted: "#94a3b8",
        borderGlass: "rgba(255, 255, 255, 0.08)",
      },
      fontFamily: {
        display: ["Plus Jakarta Sans", "Inter", "sans-serif"],
        sans: ["Plus Jakarta Sans", "Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.4)",
        glassHover: "0 12px 40px 0 rgba(6, 182, 212, 0.2)",
        glowCyan: "0 0 20px rgba(6, 182, 212, 0.35)",
        glowIndigo: "0 0 20px rgba(99, 102, 241, 0.35)",
      },
      animation: {
        'float-slow': 'floatSlow 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'slide-up': 'slideUpFade 0.4s ease-out forwards',
        'shimmer': 'shimmer 2.5s infinite',
      },
    },
  },
  plugins: [],
};
