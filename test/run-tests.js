require('require-self-ref')
require('babel-polyfill')

const Mocha = require('mocha')
const glob = require('glob')

const mocha = new Mocha({
  ui: 'bdd',
  reporter: 'list'
})

const unitTests = glob.sync(`${__dirname}/unit/**/*.js`)
const integrationTests = glob.sync(`${__dirname}/integration/**/*.js`)

const tests = unitTests.concat(integrationTests)

tests.forEach((testFile) => {
  mocha.addFile(testFile)
})

mocha.run((failures) => {
  process.on('exit', () => {
    process.exit(failures)
  })
})
