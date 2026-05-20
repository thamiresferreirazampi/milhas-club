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
          blue:           '#2563EB',
          'blue-hover':   '#3B82F6',
          black:          '#0E1117',
          card:           '#1A1F2B',
          'card-elevated':'#212838',
          border:         '#2E3548',
          gray:           '#6D7280',
          'gray-light':   '#B9C0CC',
          'text-secondary':'#E5E7EB',
          success:        '#22C55E',
          warning:        '#F59E0B',
          error:          '#EF4444',
        },
        primary: {
          500: '#2563EB',
          600: '#3B82F6',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
