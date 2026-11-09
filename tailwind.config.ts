import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: { DEFAULT: "#F3EEE1", 2: "#E8E1CF" },
        ink: { DEFAULT: "#14120D", 2: "#2A2720" },
        banana: { DEFAULT: "#FFE135", deep: "#E3B500" },
        muted: "#6B6657",
      },
      fontFamily: {
        display: ["var(--font-anybody)", "Arial Narrow", "Impact", "sans-serif"],
        sans: ["var(--font-geist)", "system-ui", "sans-serif"],
        mono: ["var(--font-plex-mono)", "ui-monospace", "Menlo", "monospace"],
      },
      transitionTimingFunction: { out: "cubic-bezier(.2,.7,.1,1)" },
    },
  },
  corePlugins: { preflight: false },
  plugins: [],
};
export default config;
