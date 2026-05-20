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
          blue:        '#006BFF',   // azul vibrante principal
          'blue-hover':'#0057D9',   // hover
          'blue-dark': '#071A3D',   // logo, footer, títulos
          'blue-soft': '#EAF3FF',   // fundo seções leves
          sky:         '#F5FAFF',   // fundo hero / login
          'off-white': '#F8FBFF',   // fundo app/dashboard
          border:      '#D8E8FF',   // bordas claras
          text:        '#071A3D',   // texto principal
          'text-secondary': '#334155',
          'text-muted': '#64748B',
          success:     '#22C55E',
          warning:     '#F59E0B',
          error:       '#EF4444',
        },
        primary: {
          500: '#006BFF',
          600: '#0057D9',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card:  '0 12px 35px rgba(0,107,255,0.10)',
        hover: '0 20px 45px rgba(0,107,255,0.18)',
        btn:   '0 10px 25px rgba(0,107,255,0.25)',
      },
    },
  },
  plugins: [],
}
