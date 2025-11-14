/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",

  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],

  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui"],
        title: ["Sora", "Poppins", "Inter"],
      },

      colors: {
        primary: {
          DEFAULT: "#2563EB",
          light: "#3B82F6",
          dark: "#1D4ED8",
          soft: "#93C5FD",
        },

        secondary: {
          DEFAULT: "#0C1222",
          light: "#151C2E",
          dark: "#1F2A44",
        },

        neutral: {
          100: "#F8FAFC",
          200: "#F1F5F9",
          300: "#E2E8F0",
          500: "#64748B",
          700: "#334155",
          900: "#0F172A",
        },
      },

      boxShadow: {
        btn: "0 2px 6px rgba(0,0,0,0.18)",
      },
    },
  },

  plugins: [],
};
