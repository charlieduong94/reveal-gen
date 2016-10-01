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

function _build(options, callback) {
    var templatePath = process.cwd() + '/index.marko';
    var configPath = process.cwd() + '/config.json';
    var config, rawTemplate;

    try {
        rawTemplate = fs.readFileSync(templatePath, 'utf-8');
        config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    } catch (err) {
        logger.error('Unable to read index.marko or config.json', err);
        return;
    }

    // add theme to dependencies list
    config.dependencies.push(config.theme);

    lasso.lassoPage({
        name: 'reveal presentation',
        dependencies: config.dependencies
    }, function(err, result) {
        if (err) {
            logger.error(err);
        } else {
            var preMarkoOutput = Mustache.render(rawTemplate, {
                lassoHead: result.urlsBySlot.head[0].slice(1),
                lassoBody: result.urlsBySlot.body[0].slice(1)
            });
            // HACK: temporarily move the file to this workspace so
            // that it can be compiled by marko
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

module.exports = {
    description: 'Compiles the template and outputs the minified js and css',
    exec: _build
};
