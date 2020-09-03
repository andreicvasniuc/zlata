const _ = require('lodash');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const devConfig = require('./webpack.dev.js');
const helpers = require('./helpers');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const pathToAdmin = _.partial(helpers.src, 'admin');

module.exports = merge(devConfig, {
  entry: {
    vendor: pathToAdmin('vendor.jsx'),
    admin: pathToAdmin('index.jsx')
  },

  resolve: {
    alias: {
      css: helpers.src('assets/admin/css'),
      images: helpers.src('assets/admin/images')
    }
  },

  // optimization: {
  //   splitChunks: {
  //     cacheGroups: {
  //       adminGroup: {
  //         name: 'admin',
  //         chunks: 'all',
  //         enforce: true
  //       }
  //     }
  //   }
  // },

  plugins: [
    // new MiniCssExtractPlugin({
    //   filename: 'admin'
    // }),

    new HtmlWebpackPlugin({
      template: 'src/admin/index.ejs'
    })
  ]
});