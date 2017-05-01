module.exports = {
  devtool: 'cheap-eval-source-map',
  entry: `${__dirname}/client.js`,
  output: {
    filename: 'bundle.js',
    publicPath: 'example'
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
