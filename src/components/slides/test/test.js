/* globals describe, test */
var expect = require('chai').expect

describe('slides component', function () {
  test('should wrap the given input with a section and a script', function (context) {
    var slidesBody = '<section data-markdown></section>'
    var output = context.render(slidesBody)

    expect(output.html).to.equal('<div class="slides">' + slidesBody + '</div>')
  })
})
