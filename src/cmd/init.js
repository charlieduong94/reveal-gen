/**
 * Init command
 */

var Mustache = require('mustache');
var fs = require('fs');
var revealBaseDir = require('../util/getRevealBaseDir')();
var DEFAULT_THEME = 'white';

function _gatherDependencies() {
    var dependencies = [
        'lib/js/classList.js',
        'lib/js/head.min.js',
        'lib/js/html5shiv.js',
        'js/reveal.js',
        'plugin/markdown/marked.js',
        'plugin/markdown/markdown.js',
        'plugin/highlight/highlight.js',
        'css/reveal.css',
        'lib/css/zenburn.css'
    ];
    dependencies = dependencies.map(function(dep) {
        return revealBaseDir + dep;
    });
    return dependencies;
}

function _getThemes() {
    var files = fs.readdirSync(revealBaseDir + 'css/theme');
    files = files.map(function(file) {
        if (file.endsWith('.css')) {
            return file.split('.')[0];
        }
    });
    return files.filter(function(file) {
        return file !== undefined;
    });
}

module.exports = {
    description: 'Initializes the template',
    exec: function() {
        var rl = require('readline').createInterface({
            output: process.stdout,
            input: process.stdin
        });
        rl.question('Presentation Name: ', function(name) {
            rl.question('Description: ', function(desc) {
                rl.question('Author: ', function(author) {
                    var themes = _getThemes();
                    console.log('Available Themes: ' + themes.toString().split(',').join(', '));
                    rl.question('Theme: ', function (theme) {
                        theme = theme.trim();
                        if (themes.indexOf(theme) < 0) {
                            console.log('theme not recognized');
                            console.log('defaulting to white theme');
                            theme = DEFAULT_THEME;
                        }
                        themePath = revealBaseDir + 'css/theme/' + theme + '.css';
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
                        var config = {
                            dependencies: _gatherDependencies(),
                            theme: themePath
                        };
                        console.log(config);
                        fs.writeFileSync(process.cwd() + '/config.json', JSON.stringify(config, null, 4));
                        console.log('Done!');
                        rl.close();
                    });
                });
            });
        });
    }
};
