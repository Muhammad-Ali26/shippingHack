/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        switzer: ["Switzer", "sans-serif"],
      },
      colors: {
        theme: "#00538C",
        themeGray: "#F4F7FF",
        themeOrange: "#FF745A",
        menuColor: "#00000099",
        tabColor: "#00000066",
        tabLine: "#00538C33",
        statusYellow: "#DAB227",
        statusGreen: "#00994D",
        borderColor: "#00000033",
        activeColor: "#379465"
      },
      backgroundColor: {
        inputfieldBg: "#336598",
        statusYellowBg: "#DAB2271F",
        statusGreenBg: "#00994D33"
      }


    },
  },
  plugins: [],
}