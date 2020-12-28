module.exports = {
  plugins: {
    'postcss-preset-env': {
      browsers: '> .2%, last 1 versions, not dead',
      autoprefixer: { cascade: false },
    },
  },
}
