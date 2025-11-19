export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Cinzel', 'serif'],
        arabic: ['Cairo', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#f0f7f8',
          100: '#e0eff1',
          500: '#37666B',
          600: '#0C484B',
          700: '#09383b',
          900: '#062628',
        },
        secondary: {
          500: '#577A7D',
          600: '#37666B',
        },
        accent: {
          500: '#E1A66F',
          600: '#c68e59',
        }
      }
    }
  },
  plugins: [],
};
