const { expect } = require('chai')
const buildCmd = require('~/dist/cmd/build')
const fs = require('fs')
const path = require('path')

const oldDir = process.cwd()

describe('"build" command', function () {
  // increase timeout for build
  this.timeout(10000)

  let testTempDir = path.normalize(`${__dirname}/../temp`)

  before(() => {
    if (!fs.existsSync(testTempDir)) {
      fs.mkdirSync(testTempDir)
    }

    process.chdir(testTempDir)
  })

  after(() => {
    process.chdir(oldDir)
  })

  beforeEach(() => {
    // copy page template to temp dir
    let template = fs.readFileSync(require.resolve('~/dist/templates/presentation-template.marko'), 'utf8')
    fs.writeFileSync(`${testTempDir}/presentation.marko`, template)
    // write json config to tempdir
    fs.writeFileSync(`${testTempDir}/config.json`, JSON.stringify({}))
  })

  it('should output an "index.html" file containing the compiled output', async function () {
    await buildCmd.exec()
    expect(fs.existsSync(`${testTempDir}/index.html`)).to.equal(true)
  })

  it('should be able to resolve a reveal.js theme from within the project', async function () {
    fs.writeFileSync(`${testTempDir}/config.json`, JSON.stringify({
      theme: 'reveal.js/css/theme/moon.css'
    }))
    await buildCmd.exec()
    expect(fs.existsSync(`${testTempDir}/index.html`)).to.equal(true)
  })

  it('should output an "index.html" file containing the compiled output', async function () {
    fs.writeFileSync(`${testTempDir}/theme.css`, '.theme { color: white }')
    fs.writeFileSync(`${testTempDir}/config.json`, JSON.stringify({
      theme: './theme.css'
    }))
    await buildCmd.exec()
    expect(fs.existsSync(`${testTempDir}/index.html`)).to.equal(true)
  })
})
