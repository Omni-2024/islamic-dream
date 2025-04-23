import { headers } from 'next/headers';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        'ipad': '768px', 
        'ipad-landscape': '1180px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        '3xl': '2048px',
        '4xl': '2560px',
        '5xl': '3072px',
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        header: "#36454F",
        RuqyaGray: "#36454F",
        RuqyaGreen: "#008080",
        RuqyaLightPurple: "#E6E6FA",//#E6E6FA80
        LightGray: "#E6E6FA80",
        mobilePurple:"#E6E6FA",
        RuqyaLightGreen: "#00CCCC",
      },
      fontFamily: {
        fullsans: ['"FullSans-LC50Book"', 'sans-serif'],
        fullsansbold: ['"full-sans-lc-90-bold"', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
        TheFullSans: ['TheFullSans', 'sans-serif'],
      },
      spacing:{
        "60vh":"60vh",
        "65vh":"65vh",
        "70vh": "70vh",
        "80vh": "80vh",
        "90vh": "90vh"
      }
    },
  },
  plugins: [],
};
