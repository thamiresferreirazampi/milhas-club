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
          blue:             '#1D6FFF',
          'blue-hover':     '#3B82FF',
          'blue-light':     '#60A5FA',
          black:            '#081224',
          section:          '#0B1730',
          card:             '#14213D',
          'card-hover':     '#1B2B4F',
          'card-highlight': '#203764',
          border:           '#2F4E85',
          'border-hover':   '#4F7DFF',
          gray:             '#6D7280',
          'gray-light':     '#B9C8E6',
          'text-secondary': '#EAF2FF',
          success:          '#22C55E',
          warning:          '#F59E0B',
          error:            '#EF4444',
        },
        primary: {
          500: '#1D6FFF',
          600: '#3B82FF',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card:  '0 12px 40px rgba(0,0,0,0.35)',
        hover: '0 20px 50px rgba(29,111,255,0.22)',
        blue:  '0 10px 30px rgba(29,111,255,0.35)',
      },
    },
  },
  plugins: [],
}
