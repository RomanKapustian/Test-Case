module.exports = {
  extends: ['airbnb-base', 'prettier', 'plugin:react/recommended'],
  plugins: ['react', 'prettier', 'import'],
  parser: '@babel/eslint-parser',
  parserOptions: {
    sourceType: 'module',
    allowImportExportEverywhere: true,
    requireConfigFile: false,
  },
  rules: {
    'max-len': [
      'error',
      {
        code: 80,
        tabWidth: 2,
        ignoreComments: true,
        ignoreStrings: true,
      },
    ],
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'react/display-name': 'off',
    'no-use-before-define': 'off',
    'no-underscore-dangle': 'off',
    'function-paren-newline': 'off',
    'implicit-arrow-linebreak': 'off',
    'class-methods-use-this': 'off', // https://eslint.org/docs/rules/class-methods-use-this
    'no-nested-ternary': 'off',
    'no-restricted-syntax': [
      'error',
      'ForInStatement',
      'LabeledStatement',
      'WithStatement',
    ], // https://eslint.org/docs/rules/no-restricted-syntax
  },
  env: {
    browser: true,
    node: true,
    commonjs: true,
    es2021: true,
  },
  root: true,
  globals: {
    Shopify: 'readonly',
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [['utils', './components/utils']],
        extensions: ['.js'],
      },
    },
    react: {
      pragma: 'h',
      fragment: 'Fragment',
      version: '10.11.0',
    },
  },
};
