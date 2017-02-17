exports.renderer = function (input, out) {
  out.write('<section data-markdown><script type=\'text/template\'>')

  if (typeof input === 'string' || input instanceof String) {
    out.write(input)
  } else if (input.renderBody) {
    input.renderBody(out)
  }

  out.write('</script></section>')
}
