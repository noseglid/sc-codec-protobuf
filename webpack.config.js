const path = require('path');
const { DefinePlugin } = require('webpack');
const BabiliPlugin = require("babili-webpack-plugin");

const config = {
  entry: path.join(__dirname, 'codec.js'),
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'sc-codec-protobuf.js',
    library: 'sc-codec-protobuf',
    libraryTarget: 'umd',
    publicPath: '/dist/'
  },
  module: {
    rules: [
      {
        test: /\.proto$/,
        use: 'raw-loader'
      }
    ]
  },
  plugins: [
  ],
  node: {
    fs: 'empty'
  }
};

if (process.env.NODE_ENV === 'development') {
  config.plugins.unshift(new BabiliPlugin());
  config.plugins.unshift(new DefinePlugin({ 'process': { 'env': { DEBUG: JSON.stringify('*') } } }));
  config.devtool = 'cheap-eval-source-map';
}

module.exports = config;
