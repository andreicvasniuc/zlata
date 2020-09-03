const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const helpers = require('./helpers');

module.exports = {
  resolve: {
      extensions: [ '.js', '.jsx' ]
  },

  module: {
    rules: [
      {
        test: /\.jsx$/, 
        use: 
        {
          loader: 'babel-loader', 
          query: {
            presets: ['@babel/preset-env'] 
          },
        },
        exclude: /node_modules/
      },
      {
        test: /\.html$/, 
        //use: 'ngtemplate-loader?relativeTo=' + (helpers.src()) + '/!html',
        use: [
          {
            loader: 'ngtemplate-loader',
            options: {
              relativeTo: helpers.src() + '/'
            }
          },
          {
            loader: 'html-loader'
          }
        ], 
        exclude: /node_modules/
      },
      {
        test: /\.css$/, 
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.styl$/, 
        use: ['style-loader', 'css-loader', 'stylus-loader'],
        exclude: /node_modules/
      },
      { 
        test: /\.eot(\?v=\d+\.\d+\.\d+)?(\?\-\w+)?$/, 
        use: 'file-loader' 
      },
      { 
        test: /\.(woff|woff2)($|\?)/, 
        // use:'url-loader?prefix=font/&limit=5000',
        use:{
          loader: 'url-loader',
          options: {
            prefix: 'font/',
            limit: 5000
          }
        } 
      },
      { 
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?(\?\-\w+)?$/, 
        // use: 'url-loader?limit=10000&mimetype=application/octet-stream', 
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'application/octet-stream'
          }
        }
      },
      { 
        test: /\.svg(\?v=\d+\.\d+\.\d+)?(\?\-\w+)?$/, 
        // use: 'url-loader?limit=10000&mimetype=image/svg+xml'
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'image/svg+xml'
          }
        }
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        // use: [
        //     'file-loader?hash=sha512&digest=hex&name=[hash].[ext]',
        //     'image-webpack-loader?bypassOnDebug&optimizationLevel=7&interlaced=false'
        // ]
        use: [
          {
            loader: 'file-loader',
            options: {
              hash: 'sha512',
              digest: 'hex',
              name: '[hash].[ext]'
            }
          },
          {
            loader: 'image-webpack-loader',
            options: {
              bypassOnDebug: '',
              optipng: {
                optimizationLevel: 7,
              },
              gifsicle: {
                interlaced: false,
              }
            }
          }
        ]
      }
    ]
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css'
    })
  ]
};