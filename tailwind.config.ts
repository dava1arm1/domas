import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Фирменная палитра Домас
        brand: {
          green: "#1D9E75",
          "green-light": "#5DCAA5",
          "green-pale": "#E8F7F2",
          dark: "#0F1A16",
          "dark-card": "#1A2920",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          secondary: "#F7FAF9",
          dark: "#111827",
        },
      },
      fontFamily: {
        raleway: ["var(--font-raleway)", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
      },
      animation: {
        ticker: "ticker 30s linear infinite",
        "ticker-slow": "ticker 50s linear infinite",
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "fade-up": "fadeUp 0.6s ease-out forwards",
        "slide-in": "slideIn 0.4s ease-out forwards",
        "coin-rotate": "coinRotate 8s linear infinite",
        "float": "float 4s ease-in-out infinite",
        "glow-pulse": "glowPulse 3s ease-in-out infinite",
      },
      keyframes: {
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        coinRotate: {
          "0%":   { transform: "rotateY(0deg)" },
          "100%": { transform: "rotateY(360deg)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":       { transform: "translateY(-12px)" },
        },
        glowPulse: {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%":       { opacity: "0.8", transform: "scale(1.08)" },
        },
      },
      backgroundImage: {
        "gradient-brand":
          "linear-gradient(135deg, #1D9E75 0%, #5DCAA5 100%)",
        "gradient-dark":
          "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%)",
        "gradient-hero":
          "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
