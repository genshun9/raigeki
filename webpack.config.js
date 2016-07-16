const path = require('path');
var json = require('json-loader');
var xml = require('xml-loader');

module.exports = {
  entry: {
    bundle: './src/entry.js'
  },
  output: {
    path: path.join(__dirname, 'public'),
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        loader: 'babel',
        exclude: /node_modules/,
        test: /\.js[x]?$/,
        query: {
          cacheDirectory: true,
          presets: ['react', 'es2015']
        }
      },
      {
        loader: 'json',
        test: /\.json$/
      },
      {
        loader: 'xml',
        test: /\.xml$/
      }
    ]
  }
};