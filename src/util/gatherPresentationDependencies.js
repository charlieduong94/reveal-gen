const revealBaseDir = require('./getRevealBaseDir')()

const dependencies = [
  'lib/js/classList.js',
  'lib/js/head.min.js',
  'lib/js/html5shiv.js',
  'js/reveal.js',
  'plugin/markdown/marked.js',
  'plugin/markdown/markdown.js',
  'plugin/highlight/highlight.js',
  'css/reveal.css',
  'lib/css/zenburn.css'
]

module.exports = function _gatherDependencies () {
  return dependencies.map(function (dep) {
    return revealBaseDir + dep
  })
}
