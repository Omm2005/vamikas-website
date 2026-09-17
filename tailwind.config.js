/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // canvas — warm ivory
        cream: "#F7F5F0",
        ivory: "#FCFAF4",
        paper: "#F2EFEB",
        // typography
        ink: "#1A1A1A",
        charcoal: "#2E2C2A",
        smoke: "#595959",
        // statement — deep burgundy / wine
        burgundy: "#6B1226",
        "burgundy-light": "#B04A5C",
        wine: "#9E4751",
        oxblood: "#4A0C1B",
        // signature — soft, playful pink
        pink: "#F3A8BF",
        "pink-soft": "#FADDE4",
        blush: "#D9A5B3",
        // muted neutrals
        stone: "#B8B0A4",
        sand: "#E7E1D6",
      },
      fontFamily: {
        serif: ['"Bodoni Moda"', "Georgia", "serif"],
        sans: ["Inter", "sans-serif"],
        hand: ['"La Belle Aurore"', "cursive"],
      },
      keyframes: {
        marquee: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
      },
      animation: { marquee: "marquee 42s linear infinite" },
    },
  },
  plugins: [],
};
