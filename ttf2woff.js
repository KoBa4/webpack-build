#!/usr/bin/env node

/* eslint strict: ["off"] */

'use strict'

const path = require('path')
const meow = require('meow')
const { isEmpty } = require('lodash')
const { convertAllFonts } = require('@hayes0724/web-font-converter')

const cli = meow(
  `
Usage
  $ ./ttf2woff.js <input>

Options
  -o, --output [value] Output formats. [default: woff].

Examples
  $ ./ttf2woff.js ttf -o woff (Input available formats: ['ttf', 'svg', 'otf'])

  Convert otf to woff:
  1. $ ./ttf2woff.js otf -o svg
  2. $ ./ttf2woff.js svg -o ttf
  3. $ ./ttf2woff.js ttf -o woff

  1.ttf -> woff + woff2
  2.svg -> ttf
  3.svg -> ttf -> woff + woff2
  4.otf -> svg
  5.otf -> svg -> ttf
  6.otf -> svg -> ttf -> woff + woff2
`,
  {
    description: 'Test',
    input: {
      type: 'string',
      default: 'ttf',
      isRequired: true,
    },
    flags: {
      output: {
        type: 'string',
        alias: 'o',
        default: 'woff',
      },
    },
  },
)

if (isEmpty(cli.input)) {
  cli.showHelp(1)
}

const available = {
  input: ['ttf', 'svg', 'otf'],
}
const output = []

if (cli.flags.output === 'woff') {
  output.push('.woff', '.woff2')
} else if (available.input.includes(cli.flags.output)) {
  output.push(`.${cli.flags.output}`)
}

convertAllFonts({
  pathIn: path.resolve(__dirname, 'src/fonts'),
  pathOut: path.resolve(__dirname, 'src/fonts'),
  outputFormats: output,
  inputFormats: [`.${cli.input}`],
  debug: false,
})
