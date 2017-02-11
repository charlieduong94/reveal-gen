'use strict'

var Mustache = require('mustache')
var fs = require('fs')
var revealBaseDir = require('../util/getRevealBaseDir')()
const prompt = require('../util/prompt')
var DEFAULT_THEME = 'white'

function _gatherDependencies () {
  var dependencies = [
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
  dependencies = dependencies.map(function (dep) {
    return revealBaseDir + dep
  })
  return dependencies
}

function _getThemes () {
  var files = fs.readdirSync(revealBaseDir + 'css/theme')
  files = files.map(function (file) {
    if (file.endsWith('.css')) {
      return file.split('.')[0]
    }
  })
  return files.filter(function (file) {
    return file !== undefined
  })
}

/* global console */
// allow console usage here for printouts
module.exports = {
  description: 'Initializes the template',
  exec: async function () {
    let name = await prompt('Presentation Name: ')
    let desc = await prompt('Description: ')
    let author = await prompt('Author: ')
    var themes = _getThemes()
    console.log('Available Themes: ' + themes.toString().split(',').join(', '))
    let theme = await prompt('Theme : ')
    theme = theme.trim()
    if (themes.indexOf(theme) < 0) {
      console.log('Theme not recognized')
      console.log('Defaulting to white theme')
      theme = DEFAULT_THEME
    }
    var themePath = revealBaseDir + 'css/theme/' + theme + '.css'
    console.log('Generating index.marko')
    var template = fs.readFileSync(require.resolve('../../template.marko'), 'utf-8')
    var content = Mustache.render(template, {
      name: name,
      description: desc,
      author: author,
      lassoHead: '{{{lassoHead}}}',
      lassoBody: '{{{lassoBody}}}'
    })
    fs.writeFileSync(process.cwd() + '/index.marko', content)
    var config = {
      dependencies: _gatherDependencies(),
      theme: themePath
    }
    fs.writeFileSync(process.cwd() + '/config.json', JSON.stringify(config, null, 4))
    console.log('Done!')
  }
}
