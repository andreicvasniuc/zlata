const _ = require('lodash');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const commonConfig = require('./webpack.common.js');
const helpers = require('./helpers');

const pathToAdmin = _.partial(helpers.src, 'admin');

module.exports = merge(commonConfig, {
  entry: {
    vendor: pathToAdmin('vendor.jsx'),
    admin: pathToAdmin('index.jsx')
  },

  output: {
    publicPath: '/assets/admin/'
  },

  resolve: {
    alias: {
      css: helpers.src('assets/admin/css'),
      images: helpers.src('assets/admin/images')
    }
  },

  // optimization: {
  //   runtimeChunk: 'single',
  //   splitChunks: {
  //     cacheGroups: {
  //       adminGroup: {
  //         name: 'admin',
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
    new HtmlWebpackPlugin({
      template: 'src/admin/index.ejs',
      filename: 'admin.html'
    })
  ]
});