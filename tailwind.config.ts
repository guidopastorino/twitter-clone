import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  plugins: [],
  theme: {
    extend: {
      boxShadow: {
        'equal': '0px 0px 15px',
      }
    }
  }
};
export default config;
