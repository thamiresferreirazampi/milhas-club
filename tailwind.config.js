/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue:       '#1E6BFF',
          'blue-hover': '#4D8DFF',
          black:      '#0B0B0F',
          card:       '#16181D',
          border:     '#2A2F3A',
          gray:       '#6D7280',
          'gray-light': '#A6A8B0',
        },
        primary: {
          500: '#1E6BFF',
          600: '#4D8DFF',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
