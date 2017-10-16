const path = require('path');
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');

const envConfig = process.env.NODE_ENV === 'production' ? {
  plugins: [
    new UglifyJSPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    })
  ]
} : {
  watchOptions: {
    poll: true,
    aggregateTimeout: 100
  },
  devtool: 'cheap-module-eval-source-map'
};

const sharedConfig = {
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
  }
};

module.exports = merge(sharedConfig, envConfig);