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
        // Luxury gold/black brand palette (matches MAK business card)
        gold: {
          DEFAULT: "#C9A24B",
          light: "#E4C56E",
          dark: "#A07E2E",
          deep: "#856420",
          soft: "#F5EDD8",
        },
        // Legacy tokens remapped to the gold palette so existing classes stay consistent
        blue: {
          brand: "#C9A24B",
          light: "#E4C56E",
          dark: "#A07E2E",
          muted: "#F5EDD8",
        },
        ink: "#0D0C0A",
        canvas: "#ECEEF3",
        charcoal: "#1A1C22",
        silver: {
          light: "#F4F5F8",
          DEFAULT: "#ECEEF3",
          mid: "#DDE0E8",
          dark: "#B8BDC9",
        },
        terra: "#C9A24B",
        "terra-dark": "#A07E2E",
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "var(--font-vazirmatn)", "Inter", "system-ui", "sans-serif"],
        fa: ["var(--font-vazirmatn)", "var(--font-manrope)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        card: "0 4px 24px rgba(26,28,34,0.09)",
        "card-lg": "0 12px 48px rgba(26,28,34,0.15)",
        "card-hover": "0 20px 60px rgba(26,28,34,0.20)",
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
