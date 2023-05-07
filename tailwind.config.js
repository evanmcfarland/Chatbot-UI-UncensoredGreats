/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      backgroundColor: {
        'white': '#fcfff5',    // Homepage full background, input text bar, user responses in chat, regenerate response button.
        'black': '#000',     // Shading over the app when in settings.
        '202123': '#a03ee0',
        '343541': '#a03ee0',
        '40414F': '#a03ee0',       // IDK   
        '444654': '#a03ee0',         // IDK
        'neutral-100': '#F5F3F0', //  Middle Header
        'gray-200': '#a03ee0',             // IDK
        'neutral-300': '#E8E4DC',              //  Page bottom button.
        'blue-500': '##db3db6',           //  IDK
        'gray-50': '#e6f1ec',         // Bot response background.
        'gray-500': '#A9A5A2',
      },
      textColor: {
        'black': '#000000',
        'white': '#FFFFFF',
        'gray-500': '#A9A5A2',
        'gray-800': '#524F4C',
        'neutral-800': '#524F4C',
        'neutral-700': '#6D6966',
        'neutral-900': '#3B3936',
        'neutral-200': '#EDEBE9',
        'neutral-300': '#D1CECB',
        'neutral-400': '#BFBEBB',
        'neutral-500': '#A9A5A2',
        'green-500': '#B0D9C5',
        'red-500': '#E6A8A2',
        'blue-500': '#A1D1C9',
      },
      borderColor: {
        'black': '#000000',
        'white': '#FFFFFF',
        'gray-300': '#D1CECB',
        'neutral-200': '#EDEBE9',
        'neutral-300': '#D1CECB',
        'neutral-400': '#BFBEBB',
        'neutral-500': '#A9A5A2',
        'neutral-600': '#8E8C88',
        'neutral-800': '#524F4C',
        'neutral-900': '#3B3936',
      },
    },
  },
  variants: {
    extend: {
      visibility: ['group-hover'],
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

// Not yet accounted for
// bg-[#202123]
// dark:bg-[#202123]
// dark:bg-[#343541]
// dark:bg-[#40414F]
// dark:bg-[#444654]
// bg-opacity-50
// bg-[#343541]/90
// bg-gradient
// bg-none
// bg-[#202123]
// bg-[#343541]
// dark:bg-opacity-50
// text-black/50
// dark:text-white/50
// text-sidebar
// border-white/20
// dark:border-netural-400
// border-0
// border-collapse
// focus:border-neutral-100
