const path = require('path');
const json = require('json-loader');
//var xml = require('xml-loader');

module.exports = {
  entry: {
    bundle: './src/main/entry.js'
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].js'
  },
  devtool: '#source-map',
  module: {
    loaders: [
      {loader: 'babel', exclude: /node_modules/, test: /\.js[x]?$/,
        query: {
          cacheDirectory: true,
          presets: ['react', 'es2015']
        }
      },
      {loader: 'json', test: /\.json$/}
    ]
  }
};