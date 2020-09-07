const webpack = require('webpack');
const { merge } = require('webpack-merge');
const TerserJSPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const helpers = require('./helpers');

// const commonConfig = require('./webpack.common.admin.js');
const commonConfig = require('./webpack.common.app.js');

const ENV = process.env.NODE_ENV = process.env.ENV = 'production';

module.exports = merge(commonConfig, {
  devtool: 'source-map',

  output: {
    path: helpers.root('dist'),
    filename: '[name].[hash].js',
    chunkFilename: '[id].[hash].chunk.js'
  },

  optimization: {
    // minimize: false,
    minimizer: [new TerserJSPlugin({
      terserOptions: {
        // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
        mangle: false
      }
    }), new OptimizeCSSAssetsPlugin({})]
  },

  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].[hash].css'
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'ENV': JSON.stringify(ENV)
      }
    })
  ]
});