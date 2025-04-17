const path = require('path');

module.exports = {
  entry: './test.js', // Your main widget JS file
  output: {
    filename: 'testbundle.js', // The output bundled file for SAC
    path: path.resolve(__dirname, 'dist'), // Output directory
  },
  mode: 'development', // Or 'development' for debugging
};