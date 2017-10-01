const path = require('path');

module.exports = {
  entry: './src/frontend/index.js',
  output: {
    path: path.resolve('./build'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      { test: /\.js$/, use: 'babel-loader', include: /frontend|react-icons/ },
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
  },
  devtool: 'cheap-module-eval-source-map'
};