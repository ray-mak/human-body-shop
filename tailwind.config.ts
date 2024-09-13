import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        mutedTeal: "#5D98A6",
        darkTeal: "#3A5F68",
        darkIndigo: "#29325B",
        lightIndigo: "#4C5B8B",
        lightGray: "#E9E8E6",
        deepGray: "#2C2C2E",
        warmBeige: "#C3B6A6",
        darkBeige: "#4F463B",
      },
    },
  },
  plugins: [],
  darkMode: "class",
}
export default config
