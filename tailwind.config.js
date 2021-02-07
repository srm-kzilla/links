module.exports = {
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme:{
    extend: {
      fontFamily: {
        WorkSans: ['Work Sans', 'sans-serif'],
        NotoSans: ['Noto Sans', 'sans-serif'],
      },
      width:{
        'custom': '20.66666%',
      },
      padding:{
        custom: '26px',
      },
      colors:{
        backdrop: ' rgba(0,0,0,0.3)',
        backgroundwhite: '#E0E0E0',
        lightblue: '#56CCF2',
        darkgray: '#333333',
        lightgray: '#F2F2F2',
        buttongray: '#4F4F4F',
        statusRed: '#EB5757',
        statusGreen: '#6FCF97',
      },
      boxShadow: {
        custom: '1px 1px 6px rgba(0, 0, 0, 0.25)',
      },
      fontSize:{
        'xxl':'8.9rem',
      }
    }
  },
  variants: {
    width: ["responsive", "hover", "focus"],
},
  plugins: [],
};
