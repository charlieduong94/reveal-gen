var args = process.argv.slice(2)

var cmds = require('../src/commands')
var help = cmds.help.exec

if (args.length < 1) {
  help()
} else {
  var command = cmds[args[0]]
  if (command) {
    command.exec()
  } else {
    help()
  }
}
