/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'yellow-500': '#eab308',
        'blue-500': '#3b82f6',
        'purple-500': '#a855f7',
        'green-500': '#22c55e',
        'red-500': '#ef4444',
      },
    },
  },
  plugins: [],
}

