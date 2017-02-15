// Compiled using marko@4.0.0-rc.17 - DO NOT EDIT
var marko_template = module.exports = require("marko/html").t(__filename),
    marko_helpers = require("marko/runtime/html/helpers"),
    marko_loadTag = marko_helpers.t,
    await_reorderer_tag = marko_loadTag(require("marko/taglibs/async/await-reorderer-tag")),
    init_widgets_tag = marko_loadTag(require("marko/widgets/taglib/init-widgets-tag"));

function render(input, out) {
  var data = input;

  out.w("<!DOCTYPE html>\n<html lang=\"en\"><head><title>{{name}}\n</title>\n<link rel=\"stylesheet\" href=\"{{{lassoHead}}}\"></head><body><div class=\"reveal\">{{presentationBody}}\n</div>\n<script type=\"text/javascript\" src=\"{{{lassoBody}}}\"></script><script type=\"text/javascript\">  Reveal.initialize();\n  hljs.initHighlightingOnLoad();\n</script>");

  await_reorderer_tag({}, out);

  init_widgets_tag({}, out);

  out.w("</body></html>");
}

marko_template._ = render;

marko_template.meta = {
    tags: [
      "marko/taglibs/async/await-reorderer-tag",
      "marko/widgets/taglib/init-widgets-tag"
    ]
  };
