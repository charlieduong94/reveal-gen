exports.renderer = function (input, out) {
  out.write('<div class="slides">')

  if (typeof input === 'string' || input instanceof String) {
    out.write(input)
  } else if (input.renderBody) {
    input.renderBody(out)
  }

  out.write('</div>')
}
