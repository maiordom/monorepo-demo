const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require('fs');

const config = require('../../core/config.json');
const rootDir = path.resolve(__dirname, '..');

const webpackConfig = env => ({
  entry: {
    integration: './src/integration/integration.ts',
  },
  output: {
    filename: 'integration.js',
    path: path.resolve(rootDir, 'dist/integration'),
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'integration',
          test: /\.css$/,
          chunks: 'all',
          enforce: true,
        },
      },
    },
  },
  resolve: {
    extensions: ['.js', '.ts'],
    alias: {
      core: path.resolve(__dirname, '../../core'),
    },
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'babel-loader',
      },
      {
        test: /\.svg$/,
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
        test: /\.css$/,
        use: [
          'style-loader',
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
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: false,
      template: path.resolve(rootDir, 'src/layout/demo.ejs'),
      filename: 'demo.html',
      __ENV__: env.NODE_ENV,
      __TAG__: env.TAG,
    }),
    new HtmlWebpackPlugin({
      inject: false,
      template: path.resolve(rootDir, 'src/layout/integration.ejs'),
      __ENV__: env.NODE_ENV,
      __TAG__: env.TAG,
    }),
    new webpack.DefinePlugin({
      __ENV__: JSON.stringify(env.NODE_ENV),
      __CHECKOUT_IFRAME_HOST__: JSON.stringify(
        env.CHECKOUT_IFRAME_HOST || config.checkoutIframe.env[env.NODE_ENV]
      ),
      __API_HOST__: JSON.stringify(
        env.API_HOST || config.api.env[env.NODE_ENV]
      ),
    }),
  ],
  devServer:
    env.NODE_ENV === 'development'
      ? {
          historyApiFallback: true,
          host: 'tabby.local',
          port: '8081',
          hot: true,
          https: {
            key: fs.readFileSync('../certs/tabby.local-key.pem'),
            cert: fs.readFileSync('../certs/tabby.local.pem'),
          },
        }
      : {},
});

module.exports = webpackConfig;
