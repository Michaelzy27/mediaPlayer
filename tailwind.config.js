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
        'primary-contrast': 'rgb(15 23 42)',
        secondary: '#1DA57A',
        link: '#8ab4f8',
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
};