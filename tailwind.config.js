/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        bgred: "url('https://i.pinimg.com/736x/44/cf/5a/44cf5a911b4702483c901f00ed1ab76f.jpg')",
      }
    },
    fontFamily: {
      Goblin: ["Goblin One", "serif"],
      Kanit: ["Kanit", "serif"]
    }
  },
  plugins: [],
}

