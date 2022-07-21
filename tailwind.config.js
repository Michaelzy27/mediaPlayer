module.exports = {
  mode: 'jit',
  purge: [
    './index.html',
    './src/**/*.{tsx,ts,js,ts,html}',
    './public/**/*.html'
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {}
  },
  variants: {
    extend: {}
  },
  plugins: []
};