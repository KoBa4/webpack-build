/*
const path = require('path')
const fs = require('fs')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlBeautifyPlugin = require('@nurminen/html-beautify-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const OptimizeCssAssetWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin')

const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev

const mode = isDev ? 'development' : 'production'
const filename = ext => (isDev ? `[name].${ext}` : `[name].[contenthash].${ext}`)
let devServer

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

const optimization = () => {
  const configObj = {
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        // vendor: {
        //   test: /[\\/]node_modules[\\/]/,
        //   name(module) {
        //     const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
        //     return 'vendors.common';
        //   },
        // },
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
  }

  if (isProd) {
    configObj.minimizer = [new OptimizeCssAssetWebpackPlugin(), new TerserWebpackPlugin()]
  }

  return configObj
}

const PAGES_DIR = path.join(__dirname, 'src')
const PAGES = fs.readdirSync(PAGES_DIR).filter(fileName => fileName.endsWith('.html'))

const plugins = () => {
  const basePlugins = [
    /!* new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/index.html'),
      filename: 'index.html',
      minify: {
        collapseWhitespace: isProd,
      },
    }), *!/
    ...PAGES.map(
      page =>
        new HtmlWebpackPlugin({
          template: `${PAGES_DIR}/${page}`,
          filename: `${page}`,
          minify: {
            collapseWhitespace: isProd,
          },
        }),
    ),
    reloadHtml,
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: `./css/${filename('css')}`,
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: path.resolve(__dirname, 'src/assets'), to: path.resolve(__dirname, 'app') },
      ],
    }),
    new webpack.HotModuleReplacementPlugin(),
  ]

  if (isProd) {
    basePlugins.push(
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
    )
  }

  if (isDev) {
    basePlugins.push(
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
    )
  }

  return basePlugins
}

module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: mode,
  entry: {
    main: './js/main.js',
  },
  output: {
    filename: `./js/${filename('js')}`,
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
  optimization: optimization(),
  plugins: plugins(),
  devtool: isProd ? false : 'source-map',
  module: {
    rules: [
      {
        test: /\.html$/i,
        use: [
          {
            loader: 'html-loader',
            options: {
              preprocessor: (content, loaderContext) =>
                content.replace(/<include src="(.+)"\s*\/?>(?:<\/include>)?/gi, (m, src) => {
                  const filePath = path.resolve(loaderContext.context, src)
                  loaderContext.dependency(filePath)
                  return fs.readFileSync(filePath, 'utf8')
                }),
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
              name: `./img/${filename('[ext]')}`,
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
              name: `./fonts/${filename('[ext]')}`,
            },
          },
        ],
      },
    ],
  },
}
*/
