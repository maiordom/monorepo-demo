module.exports = {
  require: [
    'babel-polyfill',
    './assets/fonts/styles.css',
    './assets/index.css',
  ],
  propsParser: require('react-docgen-typescript').withDefaultConfig().parse,
  components: 'components/**/[A-Z]*.tsx',
  ignore: ['components/Menu/MenuItem.tsx'],
  template: {
    body: {
      scripts: [
        {
          src: './utils/index.js',
        },
      ],
    },
  },
};
