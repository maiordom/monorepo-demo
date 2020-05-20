const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require('fs');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;

const config = require('../../core/config.json');
const rootDir = path.resolve(__dirname, '..');

const webpackConfig = env => ({
  entry: ['babel-polyfill', './src/index.tsx'],
  output: {
    filename: '[name].[hash].js',
    path: path.resolve(rootDir, 'dist/app'),
    publicPath: '/app',
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
    alias: {
      src: path.resolve(__dirname, '../src'),
      'ui-kit': path.resolve(__dirname, '../../ui-kit'),
      'react-router-dom': path.resolve(
        __dirname,
        '../node_modules/react-router-dom'
      ),
      react: path.resolve(__dirname, '../node_modules/react'),
      'react-dom': path.resolve(__dirname, '../node_modules/react-dom'),
      core: path.resolve(__dirname, '../../core'),
    },
  },
  optimization: {
    usedExports: true,
    splitChunks: {
      cacheGroups: {
        assets: {
          test: new RegExp('src/assets/.*'),
          name: 'assets',
          chunks: 'initial',
          enforce: true,
        },
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
                path: rootDir,
              },
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|png|webp)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'assets',
              publicPath: '/app/assets/',
              name: '[name].[ext]',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(rootDir, 'src/layout/default.ejs'),
      favicon: path.resolve(rootDir, 'src/assets/images/favicon.ico'),
      __ENV__: env.NODE_ENV,
    }),
    new webpack.DefinePlugin({
      __ENV__: JSON.stringify(env.NODE_ENV),
      __API_HOST__: JSON.stringify(
        process.env.API_HOST || env.API_HOST || config.api.env[env.NODE_ENV]
      ),
      __ANALITYCS_KEY__: JSON.stringify(
        config.amplitudeAPIKey.web[env.NODE_ENV]
      ),
      __APP_URL__: JSON.stringify(config.apps.desktop[env.NODE_ENV]),
    }),
    env.ANALYZER && new BundleAnalyzerPlugin(),
  ].filter(plugin => plugin),
  devServer:
    env.NODE_ENV === 'development'
      ? {
          historyApiFallback: {
            index: '/app/',
          },
          port: 8082,
          hot: true,
          host: 'tabby.local',
          https: {
            key: fs.readFileSync('../certs/tabby.local-key.pem'),
            cert: fs.readFileSync('../certs/tabby.local.pem'),
          },
        }
      : {},
});

module.exports = webpackConfig;
