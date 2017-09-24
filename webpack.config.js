const path = require('path');

module.exports = {
  entry: './src/frontend/index.js',
  output: {
    path: path.resolve('./src/frontend/build'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      { test: /\.js$/, use: 'babel-loader', exclude: /node_modules/ },
      { test: /\.jsx$/, use: 'babel-loader', exclude: /node_modules/ },
      { test: /\.css$/, use: [{loader: 'style-loader'},
                              {loader: 'css-loader', options: { modules: true }}]}
    ]
  },
  watchOptions: {
    poll: true,
    aggregateTimeout: 100
  }
};