const path = require('path');

module.exports = {
    entry: './widget.js',
    output: {
        filename: 'Gwidget.js',
        path: path.resolve(__dirname, './'),
    },
    mode: 'development', // Use 'development' for debugging
    optimization: {
        minimize: true, // Enable minification
    },
};