const readline = require('readline')

module.exports = function (question, options) {
  let { input, output } = options || {}
  let rl = readline.createInterface({
    output: output || process.stdout,
    input: input || process.stdin
  })

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close()
      resolve(answer)
    })
  })
}
