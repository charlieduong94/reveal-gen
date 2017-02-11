'use strict'

const fs = require('fs')
const getThemes = require('../util/getThemes')
const listThemes = require('./list-themes').exec
const revealBaseDir = require('../util/getRevealBaseDir')()

/* global console */
// allow console usage here for printouts
module.exports = {
  description: 'Switches to another reveal.js theme',
  exec: async function () {
    let argument = process.argv.slice(3)[0]
    let themes = getThemes()
    if (argument) {
      argument = argument.trim()
      if (themes.indexOf(argument) > -1) {
        let filePath = process.cwd() + '/config.json'
        try {
          var config = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
          config.theme = revealBaseDir + 'css/theme/' + argument + '.css'
          fs.writeFileSync(filePath, JSON.stringify(config, null, 4))
        } catch (err) {
          console.log(err)
          console.log('Unable to read config file')
        }
      } else {
        console.log('Invalid theme')
        listThemes()
      }
    } else {
      console.log('Please supply a theme')
      listThemes()
    }
  }
}
