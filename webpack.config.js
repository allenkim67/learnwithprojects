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
      {
        test: /\.css$/,
        exclude: /(node_modules|global)/,
        use: [
          {loader: 'style-loader'},
          {loader: 'css-loader', options: { modules: true, localIdentName: '[local]_[hash:base64:5]' }}
        ]
      },
      {
        test: /\.css$/,
        include: /(node_modules|global)/,
        use: [
          {loader: 'style-loader'},
          {loader: 'css-loader'}
        ]
      }
    ]
  },
  watchOptions: {
    poll: true,
    aggregateTimeout: 100
  }
};