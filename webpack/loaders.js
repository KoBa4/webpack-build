const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const isDev = process.env.NODE_ENV === 'development'

const JSLoader = {
  test: /\.js$/i,
  exclude: /(node_modules|bower_components)/,
  use: ['babel-loader'],
}

const HtmlLoader = {
  test: /\.html$/i,
  use: [
    'html-loader',
    {
      loader: 'posthtml-loader',
      options: {
        plugins: [
          // eslint-disable-next-line global-require
          require('posthtml-include')({ root: path.resolve(process.cwd(), 'src') }),
          // eslint-disable-next-line global-require
          require('posthtml-expressions')({}),
        ],
      },
    },
  ],
}

const CSSLoader = {
  test: /\.(s[ac]ss|css)$/i,
  use: [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        publicPath: (resourcePath, ctx) => path.relative(path.dirname(resourcePath), ctx) + '/',
      },
    },
    'css-loader',
    'postcss-loader',
    'group-css-media-queries-loader',
    'sass-loader',
  ],
}

const IMGLoader = {
  test: /\.(jpe?g|png|gif|svg)$/i,
  use: [
    {
      loader: 'file-loader',
      options: {
        name: isDev ? './img/[name].[ext]' : './img/[name].[contenthash:8].[ext]',
      },
    },
  ],
}

const FONTLoader = {
  // test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
  test: /\.(woff(2)?)$/,
  use: [
    {
      loader: 'file-loader',
      options: {
        name: isDev ? './fonts/[name].[ext]' : './fonts/[name].[contenthash:8].[ext]',
      },
    },
  ],
}

module.exports = {
  JSLoader: JSLoader,
  HtmlLoader: HtmlLoader,
  CSSLoader: CSSLoader,
  IMGLoader: IMGLoader,
  FONTLoader: FONTLoader,
}
