/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: "#060813",
          panel: "#0f1123",
          border: "#1f2244",
          accent: "#0ea5e9", // Teal/blue
          accentLight: "#38bdf8",
          teal: "#0d9488",
          tealLight: "#14b8a6",
          purple: "#6366f1",
          purpleLight: "#818cf8",
          pink: "#db2777",
          darkText: "#64748b",
          lightText: "#f8fafc",
        }
      },
      boxShadow: {
        glow: "0 0 15px rgba(99, 102, 241, 0.4)",
        glowTeal: "0 0 15px rgba(20, 184, 166, 0.4)",
        cardGlow: "0 10px 30px -10px rgba(0, 0, 0, 0.7)",
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
