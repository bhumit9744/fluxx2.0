import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/scene/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        glass: "rgba(255, 255, 255, 0.70)",
        glassBorder: "rgba(255, 255, 255, 0.4)",
        fluxx: {
          dark: "#05070A",
          surface: "#0B0F19",
          card: "rgba(255, 255, 255, 0.7)",
          border: "rgba(255, 255, 255, 0.4)",
          text: "#142126",
          muted: "#718087",
          teal: "#0EA89A",
          warning: "#E6A23C",
          critical: "#D95353",
          borderGlow: "rgba(14, 168, 154, 0.3)",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "scan-line": "scan 3s linear infinite",
        "spin-slow": "spin 12s linear infinite",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(1000%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
} satisfies Config;
