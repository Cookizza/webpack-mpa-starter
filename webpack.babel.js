import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import config from './config';

var path = require('path');
const FixStyleOnlyEntriesPlugin = require('webpack-fix-style-only-entries');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ImageminWebpWebpackPlugin= require("imagemin-webp-webpack-plugin");

const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const webpack = require('webpack');

let configObject = [];
let entryObject = {};

config.pages.forEach(e => {
  let h = {
    inject: true,
    filename: e.file,
    template: `src/pages/${e.template}`,
    title: e.title,
    templateParameters: {
      'title': e.title
    },
    meta: e.meta,
    minify: {
      removeComments: true,
      collapseWhitespace: true
    }
  };
  configObject.push(new HtmlWebpackPlugin(h));
  entryObject = Object.assign(entryObject, entryObject, e.entry);
});

module.exports = {
  entry: {
    'main': './src/js/main.js',
    ...entryObject
  },
  output: {
    path: path.resolve(__dirname, 'dist/'),
    publicPath: '/',
    filename: 'js/[name].[hash:8].min.js'
  },
  devServer: {
    port: 8080,
    contentBase: ['./dist'],
    hot: true,
    inline: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env'
            ]
          }
        }
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'fonts/'
          }
        }]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: [
          'url-loader?name=[name].[ext]&outputPath=./img/&limit=8192',
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: false,
                quality: 10
              },
              optipng: {
                enabled: true,
              },
              pngquant: {
                quality: '65-90',
                speed: 4
              },
              gifsicle: {
                interlaced: false,
              },
              // the webp option will enable WEBP
              webp: {
                quality: 75
              }
            }
          },
        ],
      },
      {
        test: /\.(ejs)$/,
        include: path.join(__dirname, 'src'),
        use: [
          {
            loader: 'ejs-compiled-loader',
            options: {
              htmlmin: true,
              beautify: true
            }
          },
        ]
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'resolve-url-loader',
          'sass-loader'
        ]
      }
    ]
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './src/')
    }
  },
  optimization: {
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new CleanWebpackPlugin(),
    new ImageminWebpWebpackPlugin({
      config: [{
        test: /\.(jpe?g|png)/,
        options: {
          quality:  75
        }
      }],
      overrideExtension: true,
      detailedLogs: false,
      silent: false,
      strict: true
    }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: 'css/[name].[hash:8].min.css',
      chunkFilename: '[id].css'
    }),
    new FixStyleOnlyEntriesPlugin(),
    ...configObject
  ]
};
