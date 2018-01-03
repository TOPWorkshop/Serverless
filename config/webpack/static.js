const path = require('path');
const cssnano = require('cssnano');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const postcssFlexbugsFixes = require('postcss-flexbugs-fixes');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackCleanupPlugin = require('webpack-cleanup-plugin');

const rootDir = path.join(__dirname, '..', '..');

const staticDir = path.join(rootDir, 'static');
const scssDir = path.join(staticDir, 'scss');
const jsDir = path.join(staticDir, 'js');

const distDir = path.join(rootDir, 'static-dist');

module.exports = {
  entry: [
    path.join(jsDir, 'main.js'),
    path.join(scssDir, 'main.scss'),
  ],

  output: {
    path: path.join(distDir, 'js'),
    filename: '[name].js',
  },

  module: {
    rules: [{
      test: /\.(s?css)$/,
      loaders: ExtractTextPlugin.extract({
        fallback: 'style-loader', // in case the ExtractTextPlugin is disabled, inject CSS to <HEAD>
        use: [{
          loader: 'css-loader', // translates CSS into CommonJS modules
          options: {
            sourceMap: true,
          },
        }, {
          loader: 'postcss-loader', // Run post css actions
          options: {
            sourceMap: true,
            plugins() { // post css plugins, can be exported to postcss.config.js
              return [
                postcssFlexbugsFixes,
                autoprefixer,
                cssnano,
              ];
            },
          },
        }, {
          loader: 'sass-loader', // compiles SASS to CSS
          options: {
            sourceMap: true,
          },
        }],
      }),
    }, {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      options: {
        plugins: ['transform-runtime'],
        presets: ['es2015', 'stage-0'],
      },
    }, {
      test: /\.(woff|woff2|eot|ttf|svg|otf)$/,
      loader: 'file-loader',
      options: {
        name: '[name].[ext]',
        outputPath: '../fonts/',
      },
    }, {
      test: /\.(png)$/,
      loader: 'file-loader',
      options: {
        name: '[name].[ext]',
        outputPath: '../images/',
      },
    }],
  },

  plugins: [
    new webpack.optimize.CommonsChunkPlugin({ // seperate vendor chunks
      name: ['manifest'],
    }),
    new ExtractTextPlugin('../css/[name].css'),
    new WebpackCleanupPlugin({ quiet: true }),
    new webpack.optimize.UglifyJsPlugin({ minimize: true }),
    new HtmlWebpackPlugin({
      filename: '../index.html',
      template: path.join(staticDir, 'index.html'),
    }),
  ],
};
