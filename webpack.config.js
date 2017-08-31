var webpack = require('webpack');
module.exports = {
  entry: './src/index.js',
  output: {
    path: './dist',
    filename: 'app.bundle.js'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader?presets[]=es2015'
    },{
      test: /\.css$/,
      loader: 'style-loader!css-loader?modules' },
      {
        test   : /\.woff([?]?.*)/,
        loader : 'url?prefix=font/&limit=10000&mimetype=application/font-woff'
      }, {
        test   : /\.ttf([?]?.*)/,
        loader : 'file?prefix=font/'
      }, {
        test   : /\.eot([?]?.*)/,
        loader : 'file?prefix=font/'
      }, {
        test   : /\.svg([?]?.*)/,
        loader : 'file?prefix=font/'
      }
    ]
    ,noParse: [/xregexp/]
  },
  resolve: {
    alias: {
      'vue': 'vue/dist/vue.js'
    }
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ]
};