'use strict'

const http = require('http')
const fs = require('fs')
const build = require('./build').exec
const logger = require('../logger')
const open = require('opn')
const READ_PERMISSION = fs.constants ? fs.constants.R_OK : fs.R_OK
const chokidar = require('chokidar')

const options = {
  port: 8000,
  hotreload: true
}

function _getOptions () {
  var args = require('argly').createParser({
    '--port -p': 'number',
    '--hotreload -h': 'boolean'
  }).parse(process.argv.slice(3))
  return Object.assign(options, args)
}

module.exports = {
  description: 'Serves up the presentation in the browser',
  exec: async function () {
    // get options
    let options = _getOptions()
    await build()
    let server = http.createServer(function (req, res) {
      let filePath = process.cwd()
      if (req.url === '/') {
        filePath += '/index.html'
      } else {
        filePath += req.url
      }
      fs.access(filePath, READ_PERMISSION, function (err) {
        if (err) {
          res.statusCode = 404
          res.end()
        } else {
          // prevent caching
          res.writeHead(200, {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '-1'
          })
          let readStream = fs.createReadStream(filePath)
          readStream.pipe(res)
        }
      })
    })

    let port = options.port
    server.listen(port, function () {
      logger.info('Server is now listening on port ' + port)
      logger.info('Opening presentation...')
      open('http://localhost:' + port)
    })

    chokidar.watch(process.cwd() + '/index.marko').on('change', async function (event, path) {
      logger.info('Change detected. Triggering rebuild...')
      try {
        await build()
      } catch (err) {
        logger.error(err)
      }
    })
  }
}
