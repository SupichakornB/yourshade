import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      screens: {
        xl: '1440px',
        '2xl': '1920px',
      },
    },
  },
  plugins: [],
} satisfies Config;