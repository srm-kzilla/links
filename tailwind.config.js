module.exports = {
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
    theme:{
    extend: {
      fontFamily: {
        WorkSans: ['Work Sans', 'sans-serif']
      },
      colors:{
        lightblue: '#56CCF2',
        darkgray: '#333333',
        lightgray: '#F2F2F2'
      }
    }
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
