/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors : {
        "primary-200" : "#3cce1e",
        "primary-100" : "#36d03a",
        "secondary-200" : "#0c92bf",
        "secondary-100" : "#12269e"
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        }
      },
      animation: {
        shimmer: 'shimmer 2.5s infinite linear',
      },
    },
  },
  plugins: [],
}

