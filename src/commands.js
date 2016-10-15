'use strict';

var commands = exports;
var fs = require('fs');

var cmdDir = __dirname + '/cmd';
var files = fs.readdirSync(cmdDir);

files.forEach(function(file) {
    var name = file.split('.')[0];
    commands[name] = require(cmdDir + '/' + name);
});

/* global console */
// allow console usage here for printouts
commands.help = {
    description: 'Prints out this help message',
    exec: function() {
        console.log('Usage:\n    reveal-gen <action>');
        console.log('Actions:');
        Object.keys(commands).forEach(function(name) {
            console.log('   ' + name + ' - ' + commands[name].description);
        });
    }
};
