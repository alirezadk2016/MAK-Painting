import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx,js}",
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          brand: "#1E5AA8",
          light: "#2D72D2",
          dark: "#163E7A",
          muted: "#EAF1FB",
        },
        canvas: "#F6F1EA",
        charcoal: "#141821",
        terra: "#E5572B",
        "terra-dark": "#C4431B",
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        card: "0 4px 24px rgba(20,24,33,0.08)",
        "card-lg": "0 12px 48px rgba(20,24,33,0.14)",
        "card-hover": "0 20px 60px rgba(20,24,33,0.18)",
      },
      animation: {
        "scroll-left": "scrollLeft 40s linear infinite",
        "count-up": "countUp 1.5s ease-out forwards",
      },
      keyframes: {
        scrollLeft: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
