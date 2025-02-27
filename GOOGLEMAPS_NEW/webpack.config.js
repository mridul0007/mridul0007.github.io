const path = require('path');

module.exports = {
    entry: './widget.js',
    output: {
        filename: 'widget.js',
        path: path.resolve(__dirname, './'),
    },
    mode: 'development', // Use 'development' for debugging
    optimization: {
        minimize: false, // Enable minification
    },
};