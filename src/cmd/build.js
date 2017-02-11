'use strict'

const lasso = require('lasso')
const fs = require('fs')
const Mustache = require('mustache')
const path = require('path')
const logger = require('../logger')
const WRITE_PERMISSION = fs.constants ? fs.constants.W_OK : fs.W_OK

require('marko/node-require').install()

lasso.configure({
  outputDir: 'static',
  fingerprintsEnabled: true,
  minify: true,
  resolveCssUrls: true,
  bundlingEnabled: true
})

async function _build (options) {
  let templatePath = process.cwd() + '/index.marko'
  let configPath = process.cwd() + '/config.json'
  let config, rawTemplate

  try {
    rawTemplate = fs.readFileSync(templatePath, 'utf-8')
    config = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
  } catch (err) {
    logger.error('Unable to read index.marko or config.json', err)
    return
  }

  // add theme to dependencies list
  config.dependencies.push(config.theme)

  lasso.lassoPage({
    name: 'reveal presentation',
    dependencies: config.dependencies
  }, function (err, result) {
    if (err) {
      logger.error(err)
    } else {
      let preMarkoOutput = Mustache.render(rawTemplate, {
        lassoHead: result.urlsBySlot.head[0].slice(1),
        lassoBody: result.urlsBySlot.body[0].slice(1)
      })
      // HACK: temporarily move the file to this workspace so
      // that it can be compiled by marko
      let tempDir = path.normalize(path.join(__dirname, '/../../temp'))
      fs.access(tempDir, WRITE_PERMISSION, function (err) {
        if (err) {
          fs.mkdirSync(tempDir)
        }
        let tempFilePath = tempDir + '/index.marko'

        fs.writeFileSync(tempFilePath, preMarkoOutput)
        // clear out old template if previously required
        delete require.cache[tempFilePath]
        try {
          let template = require(tempFilePath)
          let writeStream = fs.createWriteStream(path.join(process.cwd() + '/index.html'))
          template.render({}, writeStream)
          logger.info('Build Complete')
        } catch (err) {
          logger.error('Unable to build template')
          logger.error(err.toString())
        }
      })
    }
  })
}

module.exports = {
  description: 'Compiles the template and outputs the minified js and css',
  exec: _build
}
