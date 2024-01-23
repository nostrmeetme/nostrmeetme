/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{html,js,svelte,ts}',
  ],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography"),require("daisyui")],
  daisyui: {
    themes: [
      {
        mytheme: {
          
          "primary": "#5b21b6",
                   
          "secondary": "#86198f",
                   
          "accent": "#ea580c",
                   
          "neutral": "#1f2937",
                   
          "base-100": "#111827",
                   
          "info": "#7c3aed",
                   
          "success": "#c026d3",
                   
          "warning": "#ca8a04",
                   
          "error": "#991b1b",
         },
      },
    ],
  },
}

