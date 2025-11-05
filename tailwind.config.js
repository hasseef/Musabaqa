/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "#1B9E4B", 200: "#6CC24A" },
        secondary: "#1D4ED8",
        accent: "#FDB022",
        neutral: "#0F172A",
      },
      borderRadius: { '2xl': '1rem', '3xl': '1.25rem' },
      boxShadow: { soft: "0 10px 30px rgba(16,24,40,.08)" }
    },
  },
  plugins: [],
}
