const _ = require('lodash');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const commonConfig = require('./webpack.common.js');
const helpers = require('./helpers');

const pathToApp = _.partial(helpers.src, 'app');

module.exports = merge(commonConfig, {
  entry: {
    vendor: pathToApp('vendor.jsx'),
    app: pathToApp('index.jsx')
  },

  output: {
    publicPath: '/assets/app/'
  },

  resolve: {
    alias: {
      css: helpers.src('assets/app/css'),
      images: helpers.src('assets/app/images'),
      js: helpers.src('assets/app/js')
    }
  },

  // optimization: {
  //   runtimeChunk: 'single',
  //   splitChunks: {
  //     cacheGroups: {
  //       appGroup: {
  //         name: 'app',
  //         chunks: 'all'
  //       },
  //       vendorGroup: {
  //         name: 'vendor',
  //         chunks: 'all'
  //       }
  //     }
  //   }
  // },

  plugins: [
    new webpack.ProvidePlugin({
        jQuery: 'jquery',
        $: 'jquery',
        jquery: 'jquery',
        'window.jQuery': 'jquery'
    }),

    new HtmlWebpackPlugin({
      template: 'src/app/index.ejs'
    })
  ]
});