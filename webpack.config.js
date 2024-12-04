const path = require('path');

module.exports = {
  mode: 'production',
  entry: {
    popup: path.resolve(__dirname, './src/popup.jsx'),
    background: path.resolve(__dirname, './src/background.js'),
    content: path.resolve(__dirname, './src/content.js')
  },
  output: {
    path: path.resolve(__dirname, './'),
    filename: '[name].js',
    clean: false
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  }
};