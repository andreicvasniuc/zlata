const webpack = require('webpack');
const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.common.js');
const helpers = require('./helpers');

const ENV = process.env.NODE_ENV = process.env.ENV = 'development';
const API_URL = 'http://localhost:3000';

module.exports = merge(commonConfig, {
  output: {
    path: helpers.root('../public/javascripts'),
    //path: pathApp(),
    filename: '[name].js', // Template based on keys in entry above
    chunkFilename: '[id].chunk.js',
    publicPath: '/'
  },

  devServer: {
    headers: {"Access-Control-Allow-Origin": API_URL}
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'ENV': JSON.stringify(ENV),
        'API_URL': JSON.stringify(API_URL)
      }
    })
  ]
});