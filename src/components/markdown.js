'use strict';

exports.render = function(input, out) {
    out.write('<section data-markdown><script type=\'text/template\'>\n');
    input.renderBody(out);
    out.write('\n</script></section>');
};
