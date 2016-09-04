var http = require('http');
var fs = require('fs');
var path = require('path');
var build = require('./build').exec;
var logger = require('../logger');
var open = require('opn');
var READ_PERMISSION = fs.constants ? fs.constants.R_OK : fs.R_OK;

var options = {
    port: 8000,
    hotreload: true
};

function _getOptions() {
    var args = require('argly').createParser({
        '--port -p': 'number',
        '--hotreload -h': 'boolean'
    }).parse(process.argv.slice(3));
    Object.keys(args).forEach(function(key) {
        options[key] = args[key];
    });
    return options;
}

module.exports = {
    description: 'Serves up the presentation in the browser',
    exec: function() {
        // get options
        var options = _getOptions();
        build(null, function() {
            var server = http.createServer(function(req, res) {
                var filePath = process.cwd();
                if (req.url === '/') {
                    filePath += '/index.html';
                } else {
                    filePath += req.url;
                }
                fs.access(filePath, READ_PERMISSION, function(err) {
                    if (err) {
                        res.statusCode = 404;
                        res.end();
                    } else {
                        // prevent caching
                        res.writeHead(200, {
                            'Cache-Control': 'no-cache, no-store, must-revalidate',
                            'Pragma': 'no-cache',
                            'Expires': '-1'
                        });
                        var readStream = fs.createReadStream(filePath);
                        readStream.pipe(res);
                    }
                });
            });

            var port = options.port;
            server.listen(port, function() {
                logger.info('Server is now listening on port ' + port);
                logger.info('Opening presentation...');
                open('http://localhost:' + port);
            });

            fs.watch(process.cwd() + '/index.marko', function(eventType, change){
                logger.info('Change detected. Triggering rebuild...');
                try {
                    build();
                } catch (err) {
                    logger.error(err);
                }
            });
        });
    }
};
