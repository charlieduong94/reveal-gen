const args = process.argv.slice(2)

const cmds = require('../src/commands')
const help = cmds.help.exec

if (args.length < 1) {
  help()
} else {
  let command = cmds[args[0]]
  if (command) {
    command.exec().catch((err) => {
      console.error(err)
    })
  } else {
    help()
  }
}
