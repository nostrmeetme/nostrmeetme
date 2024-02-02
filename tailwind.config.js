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
        // https://paletton.com/#uid=74C1q0kXR++iTVKu7+h+WvBZtlo
        mytheme: {
          
          "primary": "#8200E5",
                   
          "secondary": "#E45B00",
                   
          "accent": "#5E2500",
                   
          "neutral": "#301745",
                   
          "base-100": "#160027",
                   
          "info": "#B76CF1",
                   
          "success": "#62F0D8",
                   
          "warning": "#FFA569",
                   
          "error": "#FFFA69",
         },
      },
    ],
  },
}

