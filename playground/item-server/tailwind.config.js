/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.html', './src/**/*.ejs'],
  theme: {
    extend: {
      boxShadow:{
        'custom': '0 10px 15px -3px #FF0000, 0 4px 6px -2px #FF0000'
      }
    },
  },
  variants: {
    extend: {
      boxShadow: ['hover']
    }
  },
  plugins: [],
}

