const { merge } = require('webpack-merge')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const OptimizeCssAssetWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const common = require('./webpack.common.js')
const { ImageMinimizerPlugin } = require('./plugins')

module.exports = merge(common, {
  mode: 'production',
  optimization: {
    minimizer: [new OptimizeCssAssetWebpackPlugin(), new TerserWebpackPlugin()],
  },
  plugins: [ImageMinimizerPlugin],
})
