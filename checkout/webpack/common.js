const path = require('path');
const webpack = require('webpack');
const fs = require('fs');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;

const config = require('../../core/config.json');
const rootDir = path.resolve(__dirname, '..');

const webpackConfig = env => ({
  entry: ['babel-polyfill', './src/index.tsx'],
  output: {
    filename: '[name].[hash].js',
    path: path.resolve(rootDir, 'dist/checkout'),
    chunkFilename: '[name].bundle.js',
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
    alias: {
      src: path.resolve(__dirname, '../src'),
      'ui-kit': path.resolve(__dirname, '../../ui-kit'),
      react: path.resolve(__dirname, '../node_modules/react'),
      'react-dom': path.resolve(__dirname, '../node_modules/react-dom'),
      mobx: path.resolve(__dirname, '../node_modules/mobx'),
      core: path.resolve(__dirname, '../../core'),
    },
  },
  optimization: {
    usedExports: true,
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: new RegExp(
            'node_modules/(' +
              [
                'react',
                'react-dom',
                'classnames',
                'mobx',
                'mobx-react',
                'axios',
                'core-js',
                'regenerator-runtime',
                'jsonpath',
              ].join('|') +
              ')/'
          ),
          name: 'vendors',
          chunks: 'initial',
          enforce: true,
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /node_modules\/(map-obj|camelcase-keys)\/index\.js$/,
        use: 'babel-loader',
      },
      {
        test: /\.tsx?$/,
        use: 'babel-loader',
      },
      {
        test: /ui-kit\/components\/Icon\/assets\/.*\.svg$/,
        use: 'raw-loader',
      },
      {
        test: /\.svg$/,
        exclude: /ui-kit\/components\/Icon\/assets\/.*\.svg$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
            },
          },
        ],
      },
      {
        test: /\.css$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '/',
              hmr: env.NODE_ENV === 'development',
            },
          },
          {
            loader: 'css-loader',
            options: {
              modules: {
                mode: 'local',
                localIdentName: '[name]__[local]--[hash:5]',
              },
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              config: {
                path: path.resolve(__dirname, '../postcss.config.js'),
              },
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|png)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'assets',
              publicPath: 'assets',
              name: '[name].[ext]',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[hash].css',
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(rootDir, 'src/layout/default.ejs'),
      __ENV__: env.NODE_ENV,
    }),
    new CopyPlugin([
      {
        from: 'src/layout/downpayment-success.html',
        to: 'downpayment-success.html',
      },
      {
        from: 'src/layout/downpayment-cancel.html',
        to: 'downpayment-cancel.html',
      },
    ]),
    new webpack.DefinePlugin({
      __ENV__: JSON.stringify(env.NODE_ENV),
      __ANALITYCS_KEY__: JSON.stringify(
        config.amplitudeAPIKey.checkout[env.NODE_ENV]
      ),
      __API_HOST__: JSON.stringify(
        env.API_HOST || config.api.env[env.NODE_ENV]
      ),
      __APP_URL__: JSON.stringify(config.apps.desktop[env.NODE_ENV]),
      __CHECKOUT_IFRAME_HOST__: JSON.stringify(
        env.CHECKOUT_IFRAME_HOST || config.checkoutIframe.env[env.NODE_ENV]
      ),
    }),
    env.ANALYZER && new BundleAnalyzerPlugin(),
  ].filter(plugin => plugin),
  devServer:
    env.NODE_ENV === 'development'
      ? {
          historyApiFallback: true,
          host: 'tabby.local',
          port: '8080',
          hot: true,
          https: {
            key: fs.readFileSync('../certs/tabby.local-key.pem'),
            cert: fs.readFileSync('../certs/tabby.local.pem'),
          },
        }
      : {},
});

module.exports = webpackConfig;
