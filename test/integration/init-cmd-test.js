const { expect } = require('chai')
const Stream = require('~/test/util/Stream')
const fs = require('fs')
const path = require('path')

const oldDir = process.cwd()

const initCmd = require('~/dist/cmd/init')

describe('"init" command', () => {
  let inputStream, outputStream
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
    inputStream = new Stream()
    outputStream = new Stream()
  })

  afterEach(() => {
    inputStream.end()
    outputStream.end()
  })

  it('should prompt for a presentation name, description, and author', async function () {
    let initPromise = initCmd.exec(inputStream, outputStream)

    inputStream.push('\n')
    inputStream.push('\n')
    inputStream.push('\n')
    inputStream.push('\n')

    await initPromise

    expect(outputStream.getData()).to.contain('Presentation Name:')
    expect(outputStream.getData()).to.contain('Description:')
    expect(outputStream.getData()).to.contain('Author:')
  })

  it('should fill in the template file with the presentation, description, and author', async function () {
    let initPromise = initCmd.exec(inputStream, outputStream)

    const presentationName = 'presentation'
    const description = 'description'
    const author = 'author'

    inputStream.push(`${presentationName}\n`)
    inputStream.push(`${description}\n`)
    inputStream.push(`${author}\n`)
    inputStream.push(`\n`)

    await initPromise

    let presentationTemplate = fs.readFileSync(`${testTempDir}/presentation.marko`, 'utf8')
    expect(presentationTemplate).to.contain(`## ${presentationName}`)
    expect(presentationTemplate).to.contain(`#### ${description}`)
    expect(presentationTemplate).to.contain(`By ${author}`)
  })

  it('should fill in the config file with the given theme', async function () {
    let initPromise = initCmd.exec(inputStream, outputStream)

    const presentationName = 'presentation'
    const description = 'description'
    const author = 'author'
    const theme = 'moon'

    inputStream.push(`${presentationName}\n`)
    inputStream.push(`${description}\n`)
    inputStream.push(`${author}\n`)
    inputStream.push(`${theme}\n`)

    await initPromise

    let config = require('~/test/temp/config')
    let lastSlash = config.theme.lastIndexOf('/') + 1
    let lastPeriod = config.theme.lastIndexOf('.')
    let configTheme = config.theme.substring(lastSlash, lastPeriod)
    expect(configTheme).to.equal(theme)
  })
})
