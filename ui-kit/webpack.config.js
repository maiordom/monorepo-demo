const path = require('path');

const webpackConfig = () => ({
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
    alias: {
      core: path.resolve(__dirname, '../core'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(tsx?|js)$/,
        use: 'babel-loader',
      },
      {
        test: /\.html$/,
        use: 'raw-loader',
      },
      {
        test: /\.(png|svg|woff|woff2)$/,
        exclude: /ui-kit\/components\/Icon\/assets\/.*\.svg$/,
        use: ['url-loader'],
      },
      {
        test: /ui-kit\/components\/Icon\/assets\/.*\.svg$/,
        use: 'raw-loader',
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
          'postcss-loader',
        ],
      },
    ],
  },
});

module.exports = webpackConfig;
