const { Transform } = require('stream')

class Stream extends Transform {
  constructor () {
    super()
    this._data = []
  }

  _transform (chunk, encoding, callback) {
    this._data.push(chunk)
    callback()
  }

  _flush (callback) {
    callback()
  }

  getData () {
    return this._data.toString()
  }
}

module.exports = Stream
