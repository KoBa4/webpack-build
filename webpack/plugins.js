// eslint-disable-next-line no-underscore-dangle
const _MiniCssExtractPlugin = require('mini-css-extract-plugin')
// eslint-disable-next-line no-underscore-dangle
const _HtmlBeautifyPlugin = require('@nurminen/html-beautify-webpack-plugin')
// eslint-disable-next-line no-underscore-dangle
const _ImageMinimizerPlugin = require('image-minimizer-webpack-plugin')

const isDev = process.env.NODE_ENV === 'development'

const MiniCssExtractPlugin = new _MiniCssExtractPlugin({
  filename: isDev ? './css/[name].css' : './css/[name].[contenthash:8].css',
})

const HtmlBeautifyPlugin = new _HtmlBeautifyPlugin({
  config: {
    html: {
      end_with_newline: true,
      indent_size: 2,
      indent_with_tabs: true,
      indent_inner_html: true,
      preserve_newlines: true,
      unformatted: ['p', 'i', 'b', 'span'],
    },
  },
})

const ImageMinimizerPlugin = new _ImageMinimizerPlugin({
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
})

module.exports = {
  MiniCssExtractPlugin: MiniCssExtractPlugin,
  HtmlBeautifyPlugin: HtmlBeautifyPlugin,
  ImageMinimizerPlugin: ImageMinimizerPlugin,
}
