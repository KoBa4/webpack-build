module.exports = {
  plugins: {
    'postcss-preset-env': {
      browsers: '> .2%, not dead',
      autoprefixer: { cascade: false, grid: true },
      stage: 0,
    },
  },
}
