module.exports = {
  devtool: 'cheap-eval-source-map',
  entry: './client.js',
  output: {
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.proto$/,
        use: 'raw-loader'
      }
    ]
  },
  node: {
    fs: 'empty'
  }
};
