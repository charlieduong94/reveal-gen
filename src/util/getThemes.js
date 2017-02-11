'use strict'

const fs = require('fs')
const revealBaseDir = require('./getRevealBaseDir')()

module.exports = function () {
  let files = fs.readdirSync(revealBaseDir + 'css/theme')
  files = files.map(function (file) {
    if (file.endsWith('.css')) {
      return file.split('.')[0]
    }
  })
  return files.filter(function (file) {
    return file !== undefined
  })
}
