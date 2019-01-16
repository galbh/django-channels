const { resolve } = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');

const config = {
  devtool: 'cheap-module-source-map',

  entry: [
    './main.jsx',
    '../assets/scss/main.scss'
  ],

  context: resolve(__dirname, 'src'),

  output: {
    filename: 'bundle.js',
    path: resolve(__dirname, 'dist', 'core'),
    publicPath: '/static/core/'
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: `${__dirname}/src/index.html`,
      filename: 'index.html',
      favicon: resolve(__dirname, 'assets/img/favicon.png'),
      inject: 'body'
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    new webpack.optimize.UglifyJsPlugin({
      beautify: false
    }),
    new webpack.DefinePlugin({
      API_HOST: JSON.stringify(''),
      STATIC_DIR: JSON.stringify('/static/core'),
      'process.env': { NODE_ENV: JSON.stringify('production') }
    }),
    new ExtractTextPlugin({ filename: './styles/style.css', disable: false, allChunks: true }),
    new CopyWebpackPlugin([
      {
        from: resolve(__dirname, 'assets', 'audio', 'ringtone.mp3'),
        to: 'audio/ringtone.mp3'
      },
      { from: resolve(__dirname, 'sw.js'), to: '' }
    ]),
    new WebpackPwaManifest({
      name: 'Scheduler',
      short_name: 'Scheduler',
      description: 'Welcome to Scheduler',
      background_color: '#202d3d',
      theme_color: '#202d3d',
      start_url: '/static/core/index.html',
      icons: [
        {
          src: resolve('assets/img/icon.png'),
          size: '144x144' // multiple sizes
        }
      ]
    })
  ],

  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        loaders: [
          'babel-loader'
        ],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            'css-loader?modules=true&localIdentName=[name]__[local]___[hash:base64:5]',
            { loader: 'sass-loader', query: { sourceMap: false } }
          ],
          publicPath: '../'
        })
      },
      { test: /\.(png|jpg|gif)$/, use: 'url-loader?limit=15000&name=images/[name].[ext]' },
      { test: /\.eot(\?v=\d+.\d+.\d+)?$/, use: 'file-loader?name=fonts/[name].[ext]' },
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, use: 'url-loader?limit=10000&mimetype=application/font-woff&name=fonts/[name].[ext]' },
      { test: /\.[ot]tf(\?v=\d+.\d+.\d+)?$/, use: 'url-loader?limit=10000&mimetype=application/octet-stream&name=fonts/[name].[ext]' },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, use: 'url-loader?limit=10000&mimetype=image/svg+xml&name=images/[name].[ext]' }
    ]
  }
};

module.exports = config;
