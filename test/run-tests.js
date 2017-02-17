require('require-self-ref')
require('babel-polyfill')

const Mocha = require('mocha')
const glob = require('glob')

let mocha = new Mocha({
  ui: 'bdd',
  reporter: 'list'
})

let unitTests = glob.sync(`${__dirname}/unit/**/*.js`)
let integrationTests = glob.sync(`${__dirname}/integration/**/*.js`)

let tests = unitTests.concat(integrationTests)

tests.forEach((testFile) => {
  mocha.addFile(testFile)
})

mocha.run((failures) => {
  process.on('exit', () => {
    process.exit(failures)
  })
})
