import type { Config } from "tailwindcss";

const flowbite = require("flowbite-react/tailwind");

const config: Config = {
  darkMode: "selector",
  content: [
    "./node_modules/flowbite-react/lib/**/*.js",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    flowbite.content(),
  ],
  theme: {
    extend: {
      colors: {
        "white-background": "#F9F9F9",
        "blue-light": "#548CFF",
        "blue-white": "#7A89FE",
        "green-pastel": "#00BD56",
        "gray-white": "#8C8FA7",
        "blue-sky": "#92D3F5",
        "red-pastel": "#FF7A7A",
        "purple-light": "#ECE6F0",
      },
    },
  },
  plugins: [require("flowbite/plugin"), flowbite.plugin()],
};
export default config;
