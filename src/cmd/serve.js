'use strict'

const http = require('http')
const fs = require('fs')
const build = require('./build').exec
const logger = require('../logger')
const open = require('opn')
const READ_PERMISSION = fs.constants ? fs.constants.R_OK : fs.R_OK
const chokidar = require('chokidar')

const DEFAULT_OPTIONS = {
  port: 8000,
  hotReload: false,
  autoOpen: false
}

function _getCliOptions () {
  var args = require('argly').createParser({
    '--port -p': 'number',
    '--hotReload -h': 'boolean',
    '--autoOpen -o': 'boolean'
  }).parse(process.argv.slice(3))

  return args
}

class ServeCmdManager {
  constructor (server, watcher, path) {
    this._server = server
    this._fileWatcher = watcher
    this._presentationPath = path
  }

  async close () {
    return new Promise((resolve) => {
      const watcher = this._fileWatcher
      // manually unwatch the file
      watcher.unwatch(this._presentationPath)
      watcher.close()
      this._server.close(resolve)
    })
  }
}

module.exports = {
  description: 'Serves up the presentation in the browser',
  /**
   * Serves the presentation
   *
   * @param { number } options.port - the port number to serve the presentation on
   * @param { boolean } options.hotreload - whether or not to reload the presentation on file change
   * @param { boolean } options.open - whether or not to open the presentation upon serving
   *
   * @returns { ServerManager }
   */
  exec: async function (options) {
    if (!options) {
      options = _getCliOptions()
    }

    options = Object.assign(DEFAULT_OPTIONS, options)

    await build()

    const server = http.createServer(function (req, res) {
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

    const { port, autoOpen } = options

    server.listen(port, function () {
      logger.info('Server is now listening on port ' + port)
      if (autoOpen) {
        logger.info('Opening presentation...')
        open('http://localhost:' + port)
      }
    })

    const presentationPath = `${process.cwd()}/presentation.marko`
    const watcher = chokidar.watch(presentationPath)

    watcher.on('change', async function (event, path) {
      logger.info('Change detected. Triggering rebuild...')
      try {
        await build()
      } catch (err) {
        logger.error(err)
      }
    })

    return new ServeCmdManager(server, watcher, presentationPath)
  }
}
