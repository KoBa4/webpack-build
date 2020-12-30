const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const loaders = require('./loaders')
const plugins = require('./plugins')

const isDev = process.env.NODE_ENV === 'development'
const rootPath = path.join(process.cwd())
const PAGES_DIR = path.join(rootPath, 'src')
const PAGES = fs.readdirSync(PAGES_DIR).filter(fileName => fileName.endsWith('.html'))

module.exports = {
  context: path.resolve(rootPath, 'src'),
  entry: {
    main: './js/main.js',
  },
  output: {
    filename: isDev ? './js/[name].js' : './js/[name].[contenthash:8].js',
    path: path.resolve(rootPath, 'app'),
    publicPath: '',
  },
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        utilityVendor: {
          test: /[/\\]node_modules[/\\](lodash|moment|moment-timezone)[/\\]/,
          name: 'utility.chunk',
          chunks: 'all',
        },
        vendor: {
          test: /[/\\]node_modules[/\\]((?!(bootstrap|lodash|moment|moment-timezone)).*)[/\\]/,
          name: 'vendors.chunk',
          chunks: 'all',
        },
      },
    },
  },
  module: {
    rules: [
      loaders.HtmlLoader,
      loaders.JSLoader,
      loaders.CSSLoader,
      loaders.IMGLoader,
      loaders.FONTLoader,
    ],
  },
  plugins: [
    ...PAGES.map(
      page =>
        new HtmlWebpackPlugin({
          template: `${PAGES_DIR}/${page}`,
          filename: `${page}`,
        }),
    ),
    new webpack.ProgressPlugin(),
    new CleanWebpackPlugin(),
    plugins.MiniCssExtractPlugin,
    new webpack.HotModuleReplacementPlugin(),
  ],
}
