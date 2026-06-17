/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'lime-green': '#b9ff66',
        'dark-black': '#191a23',
        'light-gray': '#f3f3f3',
      },
    },
  },
  plugins: [],
}
