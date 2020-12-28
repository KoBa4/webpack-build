const { convertAllFonts } = require('@hayes0724/web-font-converter')
const path = require('path')

convertAllFonts({
  pathIn: path.resolve(__dirname, 'src/fonts'),
  pathOut: path.resolve(__dirname, 'src/fonts'),
  outputFormats: ['.woff', '.woff2'],
  inputFormats: ['.ttf', '.otf', '.svg'],
  debug: false,
})
