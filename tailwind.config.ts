import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          950: "#060608",
          900: "#0b0b0e",
          800: "#121217",
          700: "#1a1a21",
          600: "#262630",
        },
        charcoal: {
          DEFAULT: "#0f0f11",
          light: "#18181b",
          medium: "#27272a",
          dark: "#09090b",
        },
        gold: {
          DEFAULT: "#d4af37",
          light: "#f5d061",
          dark: "#a67c1e",
          50: "#fdfbf4",
          100: "#faf4df",
          200: "#f4e6b8",
          300: "#ebd387",
          400: "#f5d061",
          500: "#d4af37",
          600: "#b38728",
          700: "#8c661d",
          800: "#694a14",
          900: "#45300d",
        },
        champagne: {
          DEFAULT: "#f3e8d2",
          light: "#faf4e8",
          dark: "#dec8a2",
        },
        ivory: {
          DEFAULT: "#faf8f4",
          soft: "#f4f1ea",
          warm: "#eee9de",
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Playfair Display", "Georgia", "serif"],
        sans: ["var(--font-inter)", "Inter", "Helvetica", "Arial", "sans-serif"],
      },
      boxShadow: {
        luxury: "0 10px 40px -10px rgba(0,0,0,0.6)",
        "gold-glow": "0 0 30px rgba(212,175,55,0.22)",
        "gold-glow-lg": "0 0 50px rgba(212,175,55,0.35)",
        "gold-card": "0 15px 35px -5px rgba(212,175,55,0.18)",
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.45)",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        floatSlow: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.85", transform: "scale(1.02)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        float: "floatSlow 4s ease-in-out infinite",
        glow: "pulseGlow 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
