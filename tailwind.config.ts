import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canman: {
          50: '#f0f5ff',
          100: '#e0ebff',
          200: '#bae0ff',
          300: '#7cc2ff',
          400: '#36a0ff',
          500: '#0e70f5',
          600: '#0e4da4', // Target blue #0e4da4
          700: '#0a3a7d',
          800: '#0c3167',
          900: '#102a55',
          950: '#0b1b38',
        },
      },
    },
  },
  plugins: [],
};

export default config;
