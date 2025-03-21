const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  watch: false,
  entry: {},
  plugins: [
    new CopyPlugin({
      patterns: [
        // Copy package components to components directory
        {
          from: path.resolve(__dirname, 'node_modules/@tomorrow-agency'),
          to: path.resolve(__dirname, 'components'),
          globOptions: {
            ignore: ['**/package.json', '**/README.md'],
          },
        },
      ],
    }),
  ],
  output: {
    path: path.resolve(__dirname, 'components'),
  },
};
