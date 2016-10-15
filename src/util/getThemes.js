'use strict';

var fs = require('fs');
var revealBaseDir = require('./getRevealBaseDir')();

module.exports = function() {
    var files = fs.readdirSync(revealBaseDir + 'css/theme');
    files = files.map(function(file) {
        if (file.endsWith('.css')) {
            return file.split('.')[0];
        }
    });
    return files.filter(function(file) {
        return file !== undefined;
    });
};
