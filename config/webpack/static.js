const path = require('path');
const webpack = require('webpack'); // eslint-disable-line import/no-extraneous-dependencies

const postcssFlexbugsFixes = require('postcss-flexbugs-fixes'); // eslint-disable-line import/no-extraneous-dependencies
const autoprefixer = require('autoprefixer'); // eslint-disable-line import/no-extraneous-dependencies
const cssnano = require('cssnano'); // eslint-disable-line import/no-extraneous-dependencies

const ExtractTextPlugin = require('extract-text-webpack-plugin'); // eslint-disable-line import/no-extraneous-dependencies
const HtmlWebpackPlugin = require('html-webpack-plugin'); // eslint-disable-line import/no-extraneous-dependencies
const WebpackCleanupPlugin = require('webpack-cleanup-plugin'); // eslint-disable-line import/no-extraneous-dependencies

const endpoints = require('../../endpoints');

const ENDPOINTS = {};

Object.keys(endpoints).forEach((endpoint) => {
  const endpointObj = endpoints[endpoint];
  const keys = Object.keys(endpointObj);

  if (keys.length === 0) {
    return;
  }

  ENDPOINTS[endpoint] = JSON.stringify(endpointObj[keys[0]]);
});

const rootDir = path.join(__dirname, '..', '..');

const staticDir = path.join(rootDir, 'static');
const scssDir = path.join(staticDir, 'scss');
const jsDir = path.join(staticDir, 'js');

const distDir = path.join(rootDir, 'static-dist');

const isProd = process.env.NODE_ENV === 'production';

const scssLoaders = [
  'css-loader',
  {
    loader: 'postcss-loader',
    options: {
      ident: 'postcss',
      sourceMap: true,
      plugins: () => {
        const plugins = [
          postcssFlexbugsFixes(),
          autoprefixer(),
        ];

        if (isProd) {
          plugins.push(cssnano());
        }

        return plugins;
      },
    },
  },
  'sass-loader?sourceMap',
];

module.exports = {
  entry: {
    main: [
      path.join(jsDir, 'main.js'),
      path.join(scssDir, 'main.scss'),
    ],
  },

  output: {
    path: path.join(distDir, 'js'),
    filename: '[name].js',
  },

  module: {
    rules: [{
      test: /\.s?css$/,
      loaders: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: scssLoaders,
      }),
    }, {
      test: /\.vue$/,
      loader: 'vue-loader',
      options: {
        extractCSS: true,
        loaders: {
          scss: scssLoaders,
        },
      },
    }, {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      options: {
        plugins: ['transform-runtime'],
        presets: [
          ['env', {
            targets: {
              browsers: ['last 2 versions', 'safari >= 7'],
            },
          }],
          'stage-0',
        ],
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

  resolve: {
    alias: {
      vue$: 'vue/dist/vue.esm.js',
    },
    extensions: ['*', '.js', '.vue', '.json'],
  },

  plugins: [
    new webpack.optimize.CommonsChunkPlugin({ // seperate vendor chunks
      name: ['vendor', 'manifest'],
    }),
    new ExtractTextPlugin('../css/[name].css'),
    new WebpackCleanupPlugin({ quiet: true }),
    new HtmlWebpackPlugin({
      filename: '../index.html',
      template: path.join(staticDir, 'index.html'),
    }),

    new webpack.DefinePlugin({
      ENDPOINTS,
    }),
  ],

  devtool: `#${isProd ? '' : 'eval-'}source-map`,
};

if (isProd) {
  module.exports.plugins = [
    ...module.exports.plugins,

    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false,
      },
    }),

    new webpack.LoaderOptionsPlugin({
      minimize: true,
    }),
  ];
}
