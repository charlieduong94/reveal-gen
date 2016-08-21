/**
 * Init command
 */

var Mustache = require('mustache');
var fs = require('fs');

module.exports = {
    description: 'Initializes the template',
    exec: function() {
        var rl = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        });
        rl.question('Presentation Name: ', function(name) {
            rl.question('Description: ', function(desc) {
                rl.question('Author: ', function(author) {
                    console.log('Generating index.marko');
                    var template = fs.readFileSync(require.resolve('../../template.marko'), 'utf-8');
                    var content = Mustache.render(template, {
                        name: name,
                        description: desc,
                        author: author,
                        lassoHead: '{{{lassoHead}}}',
                        lassoBody: '{{{lassoBody}}}'
                    });
                    fs.writeFileSync(process.cwd() + '/index.marko', content);
                    console.log('Done!');
                    rl.close();
                });
            });
        });
    }
};
