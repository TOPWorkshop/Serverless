const path = require('path');
const slsw = require('serverless-webpack');
const nodeExternals = require('webpack-node-externals');

const rootDir = path.join(__dirname, '..', '..');

module.exports = {
  entry: slsw.lib.entries,

  output: {
    libraryTarget: 'commonjs',
    path: path.join(rootDir, '.webpack'),
    filename: '[name].js',
  },

  target: 'node',
  externals: [nodeExternals()],

  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel-loader',
      include: path.join(rootDir, 'users'),
      exclude: /node_modules|static/,
      options: {
        plugins: ['transform-runtime'],
        presets: ['es2015', 'stage-0'],
      },
    }],
  },
};
