const path = require('path');

module.exports = {
    entry: './widget.js',
    output: {
        filename: 'widget.js',
        path: path.resolve(__dirname, './'),
    },
    mode: 'production', // Use 'development' for debugging
    optimization: {
        minimize: true, // Enable minification
    },
};