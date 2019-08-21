import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import config from './config';

var path = require('path');
const FixStyleOnlyEntriesPlugin = require('webpack-fix-style-only-entries');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const WebappWebpackPlugin = require('webapp-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ImageminWebpWebpackPlugin = require('imagemin-webp-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const webpack = require('webpack');

let configObject = [];
let entryObject = {};

config.pages.forEach(e => {
  let h = {
    inject: true,
    filename: e.file,
    chunks: e.chunks,
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
        test: /\.(woff(2)?|ttf|otf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        exclude: /img/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'fonts/'
          }
        }]
      },
      {
        test: /\.(pdf)(\?v=\d+\.\d+\.\d+)?$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'pdf/'
          }
        }]
      },
      {
        test: /\.(xls?m)(\?v=\d+\.\d+\.\d+)?$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'xls/',
          },
        }],
      },
      {
        type: 'javascript/auto',
        test: /\.json$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: './json/[name].[ext]'
            }
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: [
          'url-loader?name=[name].[ext]&outputPath=./img/&limit=8192',
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
                quality: 90
              },
              optipng: {
                enabled: false,
              },
              pngquant: {
                quality: '90',
                speed: 4
              },
              gifsicle: {
                interlaced: false,
              },
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
    minimizer: [new TerserJSPlugin({
      terserOptions: {
        compress: {
          drop_console: true,
        },
      }
    }), new OptimizeCSSAssetsPlugin({})]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new CleanWebpackPlugin({
      cleanAfterEveryBuildPatterns: ['./assets/*.webp'],
    }),
    new ImageminWebpWebpackPlugin({
      config: [{
        test: /\.(jpe?g|png)/,
        options: {
          quality: 75
        }
      }],
      overrideExtension: true,
      detailedLogs: false,
      silent: true,
      strict: true
    }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: 'css/[name].[hash:8].min.css',
      chunkFilename: '[id].css'
    }),
    new FixStyleOnlyEntriesPlugin(),
    ...configObject,
    new WebappWebpackPlugin({ logo: './favicon.png', favicons: {appName: null, appDescription: null }}),
    new CompressionPlugin({
      filename: '[path].gz[query]',
    })
  ]
};
