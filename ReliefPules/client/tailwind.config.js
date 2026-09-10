/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          850: '#08345A',
          900: '#062B4C',
          950: '#041F38',
        },
        brand: {
          blue: '#1268E8',
          'blue-hover': '#0d56c4',
          'blue-light': '#EBF3FE',
          red: '#F52D3D',
          'red-hover': '#dc2030',
          'red-light': '#FEECEE',
          green: '#20A464',
          'green-light': '#E8F7F0',
          orange: '#FF8A1F',
          'orange-light': '#FFF4EB',
        },
        theme: {
          bg: '#F3F7FC',
          card: '#FFFFFF',
          text: '#172B4D',
          muted: '#667085',
          border: '#E4EAF2',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 8px -1px rgba(0, 0, 0, 0.05), 0 1px 3px -1px rgba(0, 0, 0, 0.03)',
        'card': '0 1px 3px 0 rgba(16, 24, 40, 0.06), 0 1px 2px 0 rgba(16, 24, 40, 0.04)',
        'elevated': '0 4px 14px 0 rgba(18, 104, 232, 0.15)',
        'emergency': '0 4px 14px 0 rgba(245, 45, 61, 0.25)',
      },
      borderRadius: {
        'card': '10px',
      }
    },
  },
  plugins: [],
}
