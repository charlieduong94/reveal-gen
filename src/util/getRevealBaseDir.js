'use strict'

module.exports = function () {
  let path = require.resolve('reveal.js')
  return path.substring(0, path.length - 'js/reveal.js'.length)
}
