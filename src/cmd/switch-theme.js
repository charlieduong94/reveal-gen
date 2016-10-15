'use strict';

var fs = require('fs');
var getThemes = require('../util/getThemes');
var listThemes = require('./list-themes').exec;
var revealBaseDir = require('../util/getRevealBaseDir')();

/* global console */
// allow console usage here for printouts
module.exports = {
    'description': 'Switches to another reveal.js theme',
    'exec': function() {
        var argument = process.argv.slice(3)[0];
        var themes = getThemes();
        if (argument) {
            argument = argument.trim();
            if (themes.indexOf(argument) > -1) {
                let filePath = process.cwd() + '/config.json';
                try {
                    var config = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
                    config.theme = revealBaseDir + 'css/theme/' + argument + '.css';
                    fs.writeFileSync(filePath, JSON.stringify(config, null, 4));
                } catch (err) {
                    console.log(err);
                    console.log('Unable to read config file');
                }
            } else {
                console.log('Invalid theme');
                listThemes();
            }

        } else {
            console.log('Please supply a theme');
            listThemes();
        }
    }
};
