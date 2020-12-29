const path = require('path')
const fs = require('fs')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const OptimizeCssAssetWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin')

const PAGES_DIR = path.join(__dirname, 'src')
const PAGES = fs.readdirSync(PAGES_DIR).filter(fileName => fileName.endsWith('.html'))

module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: 'production',
  entry: {
    main: './js/main.js',
  },
  output: {
    filename: './js/[name].[contenthash].js',
    path: path.resolve(__dirname, 'app'),
    publicPath: '',
  },
  optimization: {
    runtimeChunk: 'single',
    minimizer: [new OptimizeCssAssetWebpackPlugin(), new TerserWebpackPlugin()],
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
      {
        test: /\.html$/i,
        use: [
          'html-loader',
          {
            loader: 'posthtml-loader',
            options: {
              plugins: [
                // eslint-disable-next-line global-require
                require('posthtml-include')({ root: path.resolve(__dirname, 'src') }),
                // eslint-disable-next-line global-require
                require('posthtml-expressions')({}),
              ],
            },
          },
        ],
      },
      // JS
      {
        test: /\.js$/i,
        exclude: /(node_modules|bower_components)/,
        use: ['babel-loader'],
      },
      // Sass and css.
      {
        test: /\.(s[ac]ss|css)$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: (resourcePath, ctx) =>
                path.relative(path.dirname(resourcePath), ctx) + '/',
            },
          },
          'css-loader',
          'postcss-loader',
          'group-css-media-queries-loader',
          'sass-loader',
        ],
      },
      // Images
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: './img/[name].[contenthash].[ext]',
            },
          },
        ],
      },
      // Fonts
      {
        // test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
        test: /\.(woff(2)?)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: './fonts/[name].[contenthash].[ext]',
            },
          },
        ],
      },
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
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: './css/[name].[contenthash].css',
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: path.resolve(__dirname, 'src/assets'), to: path.resolve(__dirname, 'app') },
      ],
    }),
    new ImageMinimizerPlugin({
      minimizerOptions: {
        plugins: [
          ['gifsicle', { interlaced: true }],
          ['jpegtran', { progressive: true }],
          ['optipng', { optimizationLevel: 5 }],
          [
            'svgo',
            {
              plugins: [
                {
                  removeViewBox: false,
                },
              ],
            },
          ],
        ],
      },
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
}
