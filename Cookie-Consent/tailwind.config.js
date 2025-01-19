/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./*.{js,ts}"],
  theme: {
    extend: {
      fontFamily: {
        dancing: ['"Dancing Script"'],
      },
    },
  },
  plugins: [],
};
