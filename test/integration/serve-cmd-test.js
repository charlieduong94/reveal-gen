const { expect } = require('chai')
const serveCmd = require('~/src/cmd/serve')
const fs = require('fs')
const path = require('path')
const fetch = require('node-fetch')
const attempt = require('tri')

const oldDir = process.cwd()

describe('"serve" command', function () {
  // increase timeout for build
  this.timeout(10000)

  let testTempDir = path.normalize(`${__dirname}/../temp`)
  const indexFilePath = `${testTempDir}/index.html`
  const presentationPath = `${testTempDir}/presentation.marko`
  const configPath = `${testTempDir}/config.json`

  let serveManager
  let template

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
    template = fs.readFileSync(require.resolve('~/src/templates/presentation-template.marko'), 'utf8')
    fs.writeFileSync(presentationPath, template)

    // write json config to tempdir
    fs.writeFileSync(configPath, JSON.stringify({}))

    // delete index.html if exists
    if (fs.exists(indexFilePath)) {
      fs.unlinkSync(indexFilePath)
    }
  })

  afterEach(async function () {
    await serveManager.close()
  })

  it('should serve the presentation on the given port', async function () {
    let port = 9999
    serveManager = await serveCmd.exec({ port })
    let response = await fetch(`http://localhost:${port}`)
    let responseText = await response.text()

    let indexFileText = fs.readFileSync(`${testTempDir}/index.html`, 'utf8')
    expect(responseText).to.equal(indexFileText)
  })

  it('should rebuild the presentation upon receiving a change to the presentation template', async function () {
    let port = 8080
    serveManager = await serveCmd.exec({ port })
    let initialResponse = await fetch(`http://localhost:${port}`)
    let initialResponseText = await initialResponse.text()

    let indexFileText = fs.readFileSync(`${testTempDir}/index.html`, 'utf8')
    expect(initialResponseText).to.equal(indexFileText)

    let newTemplate = template.replace('#', '!')

    fs.writeFileSync(`${testTempDir}/presentation.marko`, newTemplate)

    await attempt(async function () {
      let response = await fetch(`http://localhost:${port}`)
      let responseText = await response.text()
      expect(responseText).to.not.equal(initialResponseText)
    }, {
      maxAttempts: 5,
      delay: 500
    })
  })
})
