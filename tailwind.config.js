/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        shopee: {
          50: "#fff7ed",
          100: "#fee2d5",
          200: "#fdbba9",
          300: "#fb8d3d",
          400: "#fb7528",
          500: "#fb5d1f",
          600: "#f05c2c",
          700: "#d63f1d",
          800: "#ad3218",
          900: "#8b2c14",
        },
      },
      fontFamily: {
        sans: ["Roboto", "sans-serif"],
      },
      boxShadow: {
        shopee: "0 1px 1px rgba(0, 0, 0, 0.1)",
        "shopee-md": "0 2px 4px rgba(0, 0, 0, 0.1)",
        "shopee-lg": "0 4px 8px rgba(0, 0, 0, 0.1)",
      },
    },
  },
  plugins: [],
};
