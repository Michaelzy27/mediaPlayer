module.exports = {
  mode: 'jit',
  purge: [
    './src/**/*.html',
    './src/**/*.tsx',
    './src/**/*.jsx',
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
