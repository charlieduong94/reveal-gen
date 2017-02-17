const { expect } = require('chai')
const { Transform } = require('stream')

const prompt = require('~/dist/util/prompt')

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

describe('prompt util', () => {
  let inputStream, outputStream

  // create fresh streams for each test case
  beforeEach(() => {
    inputStream = new Stream()
    outputStream = new Stream()
  })

  // end each stream afterwards
  afterEach(() => {
    inputStream.end()
    outputStream.end()
  })

  it('should write the given question to the output stream', async function () {
    let question = 'question?'

    let promptPromise = prompt(question, {
      input: inputStream,
      output: outputStream
    })

    inputStream.push('\n')
    inputStream.push(null)

    await promptPromise
    expect(outputStream.getData()).to.equal(question)
  })

  it('should receive the value written to the input stream', async function () {
    let question = 'question?'
    let answer = 'answer'

    let promptPromise = prompt(question, {
      input: inputStream,
      output: outputStream
    })

    inputStream.push('answer')
    inputStream.push('\n')
    inputStream.push(null)

    let result = await promptPromise
    expect(result).to.equal(answer)
  })
})
