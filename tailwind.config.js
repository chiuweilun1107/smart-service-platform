/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          600: '#2563EB',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#0f172a', // Slate 900 for high contrast
        },
        slate: {
          950: '#020617', // Ink Primary
        },
        sky: {
          400: '#38BDF8', // Electric Sky
        },
        alert: {
          600: '#dc2626',
        },
        warning: {
          500: '#f97316',
        },
        success: {
          600: '#16a34a',
        },
        neutral: {
          50: '#FDFDFD', // Canvas
        }
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans TC', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
