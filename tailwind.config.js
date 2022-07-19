module.exports = {
  mode: 'jit',
  purge: [
    './src/**/*.{html,tsx,jsx}',
    './public/**/*.html',
  ],
  theme: {},
  variants: {},
  plugins: [],
  corePlugins: {
    preflight: false,
  },
  important: true
};
