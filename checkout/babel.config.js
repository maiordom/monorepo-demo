module.exports = {
  babelrcRoots: ['.', '../ui-kit/', '../core'],
  presets: [
    '@babel/preset-typescript',
    '@babel/preset-env',
    '@babel/preset-react',
  ],
  plugins: [
    ['@babel/proposal-decorators', { legacy: true }],
    ['@babel/proposal-class-properties', { loose: true }],
    ['@babel/proposal-object-rest-spread', { loose: true }],
    ['@babel/proposal-optional-chaining'],
  ],
};
