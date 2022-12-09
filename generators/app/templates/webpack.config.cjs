const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const packageConfig = require('./package.json');
const _ = require('lodash');

const config = require('dotenv-expand').expand(require('dotenv').config()).parsed;

module.exports = {
  entry: path.resolve(__dirname, 'app.js'),
  externalsPresets: { node: true },
  target: 'node',
  externals: [nodeExternals({
    allowlist: ['nanoid'],
  })],
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.cjs',
  },
  mode: 'production',
  resolve: {
    alias: _.mapValues(packageConfig.aliases || {}, (val) => path.resolve(__dirname, val)),
    extensions: ['.webpack-loader.js', '.web-loader.js', '.loader.js', '.js', '.jsx'],
    modules: [
      path.resolve(__dirname, 'node_modules'),
    ],
  },
  module: {
    rules: [
      {
        test: /webpack\.config\.cjs/,
        use: [
          {
            loader: 'config-loader',
            options: { ...config },
          },
        ],
      },
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        resolve: {
          fullySpecified: false,
        },
      },
    ],
  },
  resolveLoader: {
    alias: {
      'config-loader': path.resolve(__dirname, 'lib/configLoader.cjs'),
    },
  },
  plugins: [
    new webpack.ProvidePlugin({
      'process.webpack': path.resolve(__dirname, 'webpack.config.cjs'),
    }),
  ],
};
