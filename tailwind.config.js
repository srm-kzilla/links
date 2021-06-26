module.exports = {
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        Inter: ["Inter", "sans-serif"],
        Mulish: ["Mulish", "sans-serif"],
      },
      width: {
        custom: "21.66666%",
      },
      padding: {
        custom: "26px",
      },
      colors: {
        backdrop: " rgba(0,0,0,0.3)",
        backgroundwhite: "#F5F5F5",
        backgroundwhiteinset: "#bababa",
        offwhite: "#F4FBF7",
        lightblue: "#56CCF2",
        darkgray: "#333333",
        lightgraycustom: "#A7A6A6",
        buttongray: "#4F4F4F",
        statusRed: "#EC5A58",
        primaryGreen: {
          DEFAULT: "#6FCF97",
          100: "#F1FAF5",
          300: "#40BEAF",
        },
        lightgray: {
          DEFAULT: "#5F5F5F",
          10: "#F2F2F2",
          25: "rgba(95, 95, 95, 0.25)",
          50: "rgba(95, 95, 95, 0.50)",
        },
      },
      boxShadow: {
        custom: "1px 1px 6px rgba(0, 0, 0, 0.25)",
      },
      fontSize: {
        xxl: "8.9rem",
      },
      inset: {
        addButton: "72%",
        37: "9.5rem",
      },
      minHeight: {
        custom: "90vh",
      },
    },
  },
  variants: {
    width: ["responsive", "hover", "focus", "group-hover"],
  },
  plugins: [],
};
