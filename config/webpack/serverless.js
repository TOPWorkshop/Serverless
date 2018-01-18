const path = require('path');
const slsw = require('serverless-webpack'); // eslint-disable-line import/no-extraneous-dependencies
const nodeExternals = require('webpack-node-externals'); // eslint-disable-line import/no-extraneous-dependencies

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
      include: path.join(rootDir, 'lambda'),
      exclude: /node_modules|static/,
      options: {
        plugins: ['transform-runtime'],
        presets: [
          ['env', {
            targets: {
              node: '6.10',
            },
          }],
          'stage-0',
        ],
      },
    }],
  },
};
