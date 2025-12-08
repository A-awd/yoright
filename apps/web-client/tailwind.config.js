export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
        arabic: ['Cairo', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#faf9f7',
          100: '#f5f3ef',
          200: '#e8e4dc',
          300: '#d5cec2',
          400: '#b8ad9c',
          500: '#9a8b76',
          600: '#7d6f5d',
          700: '#655a4b',
          800: '#544a3f',
          900: '#473f37',
          950: '#262320',
        },
        gold: {
          50: '#fdfbf7',
          100: '#faf5eb',
          200: '#f3e8d1',
          300: '#ebd7b0',
          400: '#dfc08a',
          500: '#d4a862',
          600: '#c48f3d',
          700: '#a47232',
          800: '#855c2d',
          900: '#6d4c28',
          950: '#3c2814',
        },
        charcoal: {
          50: '#f6f6f6',
          100: '#e7e7e7',
          200: '#d1d1d1',
          300: '#b0b0b0',
          400: '#888888',
          500: '#6d6d6d',
          600: '#5d5d5d',
          700: '#4f4f4f',
          800: '#454545',
          900: '#3d3d3d',
          950: '#1a1a1a',
        },
        cream: {
          50: '#fefdfb',
          100: '#fdfbf7',
          200: '#faf6ef',
          300: '#f5efe3',
          400: '#ede4d1',
          500: '#e2d5ba',
          600: '#d1be96',
          700: '#bca271',
          800: '#9f8456',
          900: '#836c48',
          950: '#453724',
        },
        success: {
          500: '#22c55e',
          600: '#16a34a',
        },
        error: {
          500: '#ef4444',
          600: '#dc2626',
        }
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'luxury': '0 4px 20px -2px rgba(0, 0, 0, 0.08)',
        'luxury-lg': '0 10px 40px -5px rgba(0, 0, 0, 0.12)',
        'luxury-xl': '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
        'card': '0 2px 8px rgba(0, 0, 0, 0.04), 0 4px 24px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 8px 30px rgba(0, 0, 0, 0.12)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    }
  },
  plugins: [],
};
