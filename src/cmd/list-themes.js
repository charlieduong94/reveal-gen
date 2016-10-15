'use strict';

var getThemes = require('../util/getThemes');

/* global console */
// allow console usage here for printouts
module.exports = {
    description: 'Lists the available themes',
    exec: function() {
        var themes = getThemes().toString().split(',').join('\n    ');
        console.log('Available themes:\n    ' + themes);
    }
};
