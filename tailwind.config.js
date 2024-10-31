/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",],
  theme: {
    extend: {
      backgroundSize: {
        '400': '400% 400%',
      },
      animation: {
        gradient: 'gradient 15s ease infinite',
        'slide-car': 'slideCar 10s linear infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-position': '0% 50%',
          },
          '50%': {
            'background-position': '100% 50%',
          },
        },
        slideCar: {
          '0%': { transform: 'translateX(-100%)' },
          '50%': { transform: 'translateX(50%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      backgroundImage: {
        'gradient-animated':
          'linear-gradient(-45deg, #0d47a1, #1976d2, #42a5f5, #90caf9)',
      },
      colors: {
        card: {
          DEFAULT: '#ffffff',
          dark: '#f0f0f0',
          hover: '#d1d5db',
        },
        shadow: {
          card: '0 20px 40px rgba(0, 0, 0, 0.15)',
          hover: '0 25px 50px rgba(0, 0, 0, 0.25)',
        },
      },
      boxShadow: {
        'card': '0 20px 40px rgba(0, 0, 0, 0.15)',
        'card-hover': '0 25px 50px rgba(0, 0, 0, 0.25)',
      },
      borderRadius: {
        '3xl': '1.5rem',
      },
      opacity: {
        '90': '0.90',
      },
    },
  },
  plugins: [],
};
