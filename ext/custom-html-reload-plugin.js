const HtmlWebpackPlugin = require('safe-require')('html-webpack-plugin')

class CustomHtmlReloadPlugin {
  // eslint-disable-next-line class-methods-use-this
  apply(compiler) {
    const cache = {}
    compiler.hooks.compilation.tap('CustomHtmlReloadPlugin', compilation => {
      HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
        'CustomHtmlReloadPlugin',
        (data, cb) => {
          console.log(data)
          const orig = cache[data.outputName]
          const { html } = data
          // if (orig && orig !== html) {
          //   devServer.sockWrite(devServer.sockets, 'content-changed')
          // }
          cb(undefined, html)
        },
      )
    })
  }
}

module.exports = CustomHtmlReloadPlugin
