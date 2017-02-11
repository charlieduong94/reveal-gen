'use strict'

const path = require('path')
const fs = require('fs')

const commands = exports

const cmdDir = path.join(__dirname, 'cmd')
const files = fs.readdirSync(cmdDir)

files.forEach(function (file) {
  let name = file.split('.')[0]
  commands[name] = require(path.join(cmdDir, name))
})

/* global console */
// allow console usage here for printouts
commands.help = {
  description: 'Prints out this help message',
  exec: async function () {
    console.log('Usage:\n    reveal-gen <action>')
    console.log('Actions:')
    Object.keys(commands).forEach(function (name) {
      console.log('   ' + name + ' - ' + commands[name].description)
    })
  }
}
