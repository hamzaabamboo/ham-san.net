/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    fontFamily: {
      sans: ['Noto Sans JP', 'Noto Sans TH', 'sans-serif']
    },
    extend: {
      colors: {
        primary: {
          50: '#fffbeb',
          100: '#fef2c7',
          200: '#fce48b',
          300: '#fbd04e',
          400: '#fabc2a',
          500: '#f49a0c',
          600: '#d87307',
          700: '#b3500a',
          800: '#913e0f',
          900: '#773310',
          950: '#451903'
        },
        'name-card': {
          50: '#eef3ff',
          100: '#dfe9ff',
          200: '#c6d5ff',
          300: '#a3b9fe',
          400: '#7f92fa',
          500: '#606df4',
          600: '#4344e8',
          700: '#3735cd',
          800: '#2e2ea5',
          900: '#2c2d83',
          950: '#1f1f5a'
        },
        secondary: '#43AA8B'
      },
      backgroundImage: {
        hasu: "url('https://assets.st-note.com/production/uploads/images/121975199/rectangle_large_type_2_64744113d43ef15f0d5c9ad5464e6a8e.jpeg?width=2000&height=2000&fit=bounds&format=jpg&quality=85')"
      },
      animation: {
        pyon: 'pyon 2s linear infinite',
        kanatapeek: 'kanatapeek 4s ease-in infinite'
      },
      keyframes: {
        pyon: {
          '0%, 25%, 50%, 100%': {
            transform: 'translateY(0%)',
            animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)'
          },
          '12.5%, 37.5%': {
            transform: 'translateY(-5%)',
            animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)'
          }
        },
        kanatapeek: {
          '0%, 75%, 100%': {
            transform: 'scaleX(-100%) translate(100%,100%)'
          },
          '25%, 50%': {
            transform: 'scaleX(-100%) translate(0,0)'
          }
        }
      }
    }
  },
  plugins: []
};
