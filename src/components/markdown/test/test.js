/* globals describe, test */
var expect = require('chai').expect

describe('markdown component', function () {
  test('should wrap the given input with a section and a script', function (context) {
    var markdownBody = '### markdown\n### more markdown'
    var output = context.render(markdownBody)

    expect(output.html).to.equal('<section data-markdown><script type=\'text/template\'>' +
      markdownBody + '</script></section>')
  })
})
