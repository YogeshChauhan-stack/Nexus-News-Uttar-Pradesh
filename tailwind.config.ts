import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fef2f2",
          100: "#fee2e2",
          500: "#ef4444",
          600: "#dc2626",
          700: "#b91c1c",
          800: "#991b1b",
          900: "#7f1d1d"
        },
        aajtak: {
          red: "#d90000",
          darkRed: "#b80000",
          navy: "#002765",
          dark: "#1D2936",
          gold: "#ffd700",
          gray: "#f1f1f1"
        }
      },
      fontFamily: {
        serif: ["Merriweather", "Georgia", "serif"],
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"]
      }
    },
  },
  plugins: [],
};
export default config;
