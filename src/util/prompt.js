const readline = require('readline')

module.exports = function (question) {
  let rl = readline.createInterface({
    output: process.stdout,
    input: process.stdin
  })

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close()
      resolve(answer)
    })
  })
}
