const webpack = require('webpack')
const path = require('path')

// variables
const isProduction = process.argv.indexOf('-p') >= 0;
const sourcePath = path.join(__dirname, './src');
const outPath = path.join(__dirname, './dist');

// plugins
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CheckerPlugin } = require('awesome-typescript-loader')

module.exports = {
  context: sourcePath,
  entry: {
    main: [
      'react-hot-loader/patch',
      './index.tsx'
    ],
    vendor: [
      'react',
      'react-dom'
    ]
  },
  output: {
    path: outPath,
    publicPath: '/',
    filename: 'bundle.js',
  },
  target: 'web',
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    modules: [path.resolve(__dirname, 'src'), 'node_modules']
  },
  module: {
    loaders: [
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader'
      }
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'vendor.bundle.js',
      minChunks: Infinity
    }),
    new CheckerPlugin(),
    new HtmlWebpackPlugin({
      template: 'index.html'
    }),
  ].concat(isProduction ? [
    new webpack.DefinePlugin({ 'process.env': { NODE_ENV: JSON.stringify('production') } }),
    new webpack.optimize.UglifyJsPlugin()
  ] : [
      new webpack.NamedModulesPlugin(),
    ]),
  devServer: {
    contentBase: sourcePath,
    hot: !isProduction,
    stats: {
      warnings: !isProduction
    },
    host: '0.0.0.0',
    disableHostCheck: true,
    inline: true,
  },
  node: {
    // workaround for webpack-dev-server issue
    // https://github.com/webpack/webpack-dev-server/issues/60#issuecomment-103411179
    fs: 'empty',
    net: 'empty'
  }
}
