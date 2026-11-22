/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        navy:  { 50:"#f0f4ff",100:"#dde5ff",200:"#b3c3ff",300:"#809bff",400:"#4d6df5",500:"#2244cc",600:"#1a35a8",700:"#132880",800:"#0d1d5c",900:"#080f38" },
        teal:  { 50:"#f0fdfc",100:"#ccfbf8",200:"#99f4f1",300:"#5ee9e6",400:"#28d4cf",500:"#14b8b4",600:"#0e9490",700:"#0c7470",800:"#0b5a57",900:"#083d3b" },
        rose:  { 500:"#f43f5e",600:"#e11d48" },
        emerald:{ 500:"#10b981",600:"#059669" },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(0,0,0,.07), 0 4px 16px 0 rgba(0,0,0,.06)",
        hover:"0 4px 24px 0 rgba(0,0,0,.12)",
      },
    },
  },
  plugins: [],
};
