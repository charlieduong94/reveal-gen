'use strict'

const Mustache = require('mustache')
const fs = require('fs')
const prompt = require('../util/prompt')
const DEFAULT_THEME = 'white'

const _getThemes = require('../util/getThemes')

function _createPrompt (options) {
  return async function (question) {
    return prompt(question, options)
  }
}

/* global console */
// allow console usage here for printouts
module.exports = {
  description: 'Initializes the template',
  exec: async function (inputStream, outputStream) {
    let promptOptions = {
      input: inputStream,
      output: outputStream
    }
    let query = _createPrompt(promptOptions)
    let name = await query('Presentation Name: ')
    let desc = await query('Description: ')
    let author = await query('Author: ')
    let themes = _getThemes()

    console.log('Available Themes: ' + themes.toString().split(',').join(', '))
    let theme = await query('Theme : ')
    theme = theme.trim()

    if (themes.indexOf(theme) < 0) {
      console.log('Theme not recognized')
      console.log('Defaulting to white theme')
      theme = DEFAULT_THEME
    }

    let themePath = 'reveal.js/css/theme/' + theme + '.css'
    console.log('Generating index.marko')

    let template = fs.readFileSync(require.resolve('../../presentation-template.marko'), 'utf-8')
    let content = Mustache.render(template, {
      name: name,
      description: desc,
      author: author
    })

    fs.writeFileSync(process.cwd() + '/presentation.marko', content)

    let config = {
      dependencies: [],
      theme: themePath
    }

    fs.writeFileSync(process.cwd() + '/config.json', JSON.stringify(config, null, 4))
    console.log('Done!')
  }
}
