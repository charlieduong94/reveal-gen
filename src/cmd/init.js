'use strict'

const Mustache = require('mustache')
const fs = require('fs')
const revealBaseDir = require('../util/getRevealBaseDir')()
const prompt = require('../util/prompt')
const DEFAULT_THEME = 'white'

const _getThemes = require('../util/getThemes')

/* global console */
// allow console usage here for printouts
module.exports = {
  description: 'Initializes the template',
  exec: async function () {
    let name = await prompt('Presentation Name: ')
    let desc = await prompt('Description: ')
    let author = await prompt('Author: ')
    let themes = _getThemes()

    console.log('Available Themes: ' + themes.toString().split(',').join(', '))
    let theme = await prompt('Theme : ')
    theme = theme.trim()

    if (themes.indexOf(theme) < 0) {
      console.log('Theme not recognized')
      console.log('Defaulting to white theme')
      theme = DEFAULT_THEME
    }

    let themePath = revealBaseDir + 'css/theme/' + theme + '.css'
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
