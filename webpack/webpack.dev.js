const path = require('path')
const { merge } = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const common = require('./webpack.common.js')
const { HtmlBeautifyPlugin } = require('./plugins')

let devServer

function ReloadHtml() {
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

module.exports = merge(common, {
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    historyApiFallback: true,
    contentBase: path.resolve(process.cwd(), 'app'),
    watchContentBase: true,
    open: true,
    compress: true,
    hot: true,
    port: 3003,
    before(app, server) {
      devServer = server
    },
  },
  plugins: [ReloadHtml, HtmlBeautifyPlugin],
})
