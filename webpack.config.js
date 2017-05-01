const path = require('path');
const BabiliPlugin = require("babili-webpack-plugin");

module.exports = {
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
    new BabiliPlugin()
  ],
  node: {
    fs: 'empty'
  }
};
