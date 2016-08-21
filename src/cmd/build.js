var lasso = require('lasso');
var fs = require('fs');
var Mustache = require('mustache');
var path = require('path');
var logger = require('../logger');
var WRITE_PERMISSION = fs.constants ? fs.constants.W_OK : fs.W_OK;

require('marko/node-require').install();

lasso.configure({
    outputDir: 'static',
    fingerprintsEnabled: true,
    minify: true,
    resolveCssUrls: true,
    bundlingEnabled: true
});

function _gatherDependencies() {
    var prefix = 'reveal.js/';
    var dependencies = [
        'lib/js/classList.js',
        'lib/js/head.min.js',
        'lib/js/html5shiv.js',
        'js/reveal.js',
        'plugin/markdown/marked.js',
        'plugin/markdown/markdown.js',
        'plugin/highlight/highlight.js',
        'css/reveal.css',
        'css/theme/night.css',
        'lib/css/zenburn.css'
    ];
    dependencies = dependencies.map(function(dep) {
        return require.resolve(prefix + dep);
    });
    return dependencies;
}

function _build(options, callback) {
    var filePath = process.cwd() + '/index.marko';
    fs.lstat(filePath, function(err, stats) {
        if (err || !stats.isFile()) {
            console.log('no index.marko found');
        } else {
            lasso.lassoPage({
                name: 'reveal presentation',
                dependencies: _gatherDependencies()
            }, function(err, result) {
                if (err) {
                } else {
                    var content = fs.readFileSync(filePath, 'utf-8');
                    var preMarkoOutput = Mustache.render(content, {
                        lassoHead: result.urlsBySlot.head[0].slice(1),
                        lassoBody: result.urlsBySlot.body[0].slice(1)
                    });
                    // HACK: temporarily move the file to this workspace so
                    // that it can be compiled by markos
                    var tempDir = path.normalize(__dirname + '/../../temp');
                    fs.access(tempDir, WRITE_PERMISSION, function(err) {
                        if (err) {
                            fs.mkdirSync(tempDir);
                        }
                        var tempFilePath = tempDir + '/index.marko';

                        fs.writeFileSync(tempFilePath, preMarkoOutput);
                        // clear out old template if previously required
                        delete require.cache[tempFilePath];
                        var template = require(tempFilePath);
                        var writeStream = fs.createWriteStream(process.cwd() + '/index.html');
                        template.render({}, writeStream);
                        logger.info('Build Complete');
                        if (callback && typeof(callback) === 'function') {
                            callback(null);
                        } else if (callback) {
                            logger.error('callback must be a function');
                        }
                    });
                }
            });
        }
    });
}

module.exports = {
    description: 'Compiles the template and outputs the minified js and css',
    exec: _build
};
