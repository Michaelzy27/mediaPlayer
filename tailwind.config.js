module.exports = {
  mode: 'jit',
  purge: [
    './index.html',
    './src/**/*.{tsx,ts,js,ts,html}',
    './public/**/*.html'
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: '#0BC8F7',
        'primary-contrast': 'white',
        secondary: '#1DA57A',
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
};