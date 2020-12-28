const path = require('path')
const fs = require('fs')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlBeautifyPlugin = require('@nurminen/html-beautify-webpack-plugin')

let devServer
const PAGES_DIR = path.join(__dirname, 'src')
const PAGES = fs.readdirSync(PAGES_DIR).filter(fileName => fileName.endsWith('.html'))

function reloadHtml() {
  const cache = {}
  this.hooks.compilation.tap('CustomHtmlReloadPlugin', compilation => {
    HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
      'CustomHtmlReloadPlugin',
      (data, cb) => {
        const orig = cache[data.outputName]
        const html = data.html
        if (orig && orig !== html) {
          devServer.sockWrite(devServer.sockets, 'content-changed')
        }
        cache[data.outputName] = html
        cb()
      },
    )
  })
}

module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: 'development',
  entry: {
    main: './js/main.js',
  },
  output: {
    filename: './js/[name].js',
    path: path.resolve(__dirname, 'app'),
    publicPath: '',
  },
  devServer: {
    historyApiFallback: true,
    contentBase: path.resolve(__dirname, 'app'),
    watchContentBase: true,
    open: true,
    compress: true,
    hot: true,
    port: 3003,
    before(app, server) {
      devServer = server
    },
  },
  devtool: 'source-map',
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        utilityVendor: {
          test: /[/\\]node_modules[/\\](lodash|moment|moment-timezone)[/\\]/,
          name: 'utility-vendor.chunk',
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
              name: './img/[name].[ext]',
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
              name: './fonts/[name].[ext]',
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
    reloadHtml,
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: './css/[name].css',
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: path.resolve(__dirname, 'src/assets'), to: path.resolve(__dirname, 'app') },
      ],
    }),
    new HtmlBeautifyPlugin({
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
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
}
