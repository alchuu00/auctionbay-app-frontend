import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        'fluoro-yellow': '#F4FF47',
        'fluoro-yellow-light': '#F9FF90',
        'fluoro-green': '#ADFF90',
        'gray-blue': '#EDF4F2',
        'dark-gray': '#272D2D',
        'background': '#F6F6F4',
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [require('flowbite/plugin')],
};
export default config;
