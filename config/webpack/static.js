const path = require('path');
const webpack = require('webpack');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackCleanupPlugin = require('webpack-cleanup-plugin');

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
          require('postcss-flexbugs-fixes')(),
          require('autoprefixer')(),
        ];

        if (isProd) {
          plugins.push(require('cssnano')());
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

    vendor: [
      'axios',
      'bootstrap',
      'jquery',
      'vue',
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
      })
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

  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
    },
    extensions: ['*', '.js', '.vue', '.json'],
  },

  plugins: [
    new webpack.ProvidePlugin({ // inject ES5 modules as global vars
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      Popper: ['popper.js', 'default'],
      // in case bootstrap's modules were imported individually, they must also be provided here:
      // Util: "exports-loader?Util!bootstrap/js/dist/util",
    }),
    new webpack.optimize.CommonsChunkPlugin({ // seperate vendor chunks
      name: ['vendor', 'manifest'],
    }),
    new ExtractTextPlugin('../css/[name].css'),
    new WebpackCleanupPlugin({ quiet: true }),
    new HtmlWebpackPlugin({
      filename: '../index.html',
      template: path.join(staticDir, 'index.html'),
    }),
  ],

  devtool: `#${isProd ? '' : 'eval-'}source-map`,
};

if (isProd) {
  module.exports.plugins = [
    ...module.exports.plugins,

    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),

    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),

    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),
  ]
}
