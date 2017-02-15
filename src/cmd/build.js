'use strict'

const lasso = require('lasso')
const fs = require('fs')
const Mustache = require('mustache')
const path = require('path')
const logger = require('../logger')
const _gatherDependencies = require('../util/gatherPresentationDependencies')
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
  const tempDir = path.normalize(path.join(__dirname, '/../../temp'))
  let presentationPath = `${process.cwd()}/presentation.marko`
  let templatePath = require.resolve('../../page-template.marko')
  let configPath = process.cwd() + '/config.json'

  let customConfig, precompiledPage, precompiledPresentation

  try {
    precompiledPage = fs.readFileSync(templatePath, 'utf8')
    precompiledPresentation = fs.readFileSync(presentationPath, 'utf8')
    customConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'))
  } catch (err) {
    logger.error('Unable to read presentation.marko or config.json', err)
    return
  }

  let dependencies = _gatherDependencies()
  dependencies.concat(customConfig.dependencies)
  dependencies.push(customConfig.theme)

  lasso.lassoPage({
    name: 'reveal presentation',
    dependencies
  }, function (err, result) {
    if (err) {
      logger.error(err)
    } else {
      let lassoHead = result.urlsBySlot.head[0].slice(1)
      let lassoBody = result.urlsBySlot.body[0].slice(1)

      // HACK: temporarily move the file to this workspace so
      // that it can be compiled by marko
      fs.access(tempDir, WRITE_PERMISSION, function (err) {
        if (err) {
          fs.mkdirSync(tempDir)
        }
        let tempPagePath = `${tempDir}/index.marko`
        let tempPresentationPath = `${tempDir}/presentation.marko`

        fs.writeFileSync(tempPagePath, precompiledPage)
        fs.writeFileSync(tempPresentationPath, precompiledPresentation)
        // clear out old template if previously required
        delete require.cache[tempPagePath]
        delete require.cache[tempPresentationPath]

        try {
          let pageTemplate = require(tempPagePath)
          let presentationTemplate = require(tempPresentationPath)

          let compiledPageTemplate = pageTemplate.renderToString()
          let compiledPresentationTemplate = presentationTemplate.renderToString()

          let completeOutput = Mustache.render(compiledPageTemplate, {
            lassoHead,
            lassoBody,
            presentationBody: compiledPresentationTemplate
          })

          fs.writeFileSync(path.join(process.cwd() + '/index.html'), completeOutput)
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
