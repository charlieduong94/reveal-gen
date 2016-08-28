'use strict';

var getThemes = require('../util/getThemes');

module.exports = {
    description: 'Lists the available themes',
    exec: function() {
        var themes = getThemes().toString().split(',').join('\n    ');
        console.log('Available themes:\n    ' + themes);
    }
};
