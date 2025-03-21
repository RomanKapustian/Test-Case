const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: process.env.NODE_ENV,
  watch: process.env.NODE_ENV === 'development' ? true : false,
  entry: {
    main: {
      import: './components/main.js',
      dependOn: 'vendor',
    },
    vendor: ['preact', 'swiper', '@vimeo/player'],
  },
  devtool:
    process.env.NODE_ENV === 'development' ? 'eval-source-map' : 'source-map',
  cache: {
    type: 'filesystem',
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              // Stops url() imports (fonts) from running
              url: false,
              sourceMap: false,
            },
          },
          {
            loader: 'postcss-loader',
          },
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'main.css',
      runtime: false,
    }),
    new CopyPlugin({
      patterns: [
        // Copy snippet components to snippets directory
        {
          from: path.resolve(__dirname, 'components/**/snippet.*.liquid').replaceAll('\\', '\/'),
          to({ absoluteFilename }) {
            const p = `snippets/${path.basename(absoluteFilename, '.liquid').split('.')[1]
              }.liquid`;
            return path.resolve(__dirname, p);
          },
        },
        // Copy section components to sections directory
        {
          from: path.resolve(__dirname, 'components/**/section.*.liquid').replaceAll('\\', '\/'),
          to({ absoluteFilename }) {
            const p = `sections/${path.basename(absoluteFilename, '.liquid').split('.')[1]
              }.liquid`;
            return path.resolve(__dirname, p);
          },
        },
        // Copy fonts to assets directory
        {
          from: path.resolve(__dirname, 'fonts/**/*.(woff|woff2)').replaceAll('\\', '\/'),
          to({ absoluteFilename }) {
            const p = `assets/${path.basename(absoluteFilename)}`;
            return path.resolve(__dirname, p);
          },
        },
      ],
    }),
  ],
  resolve: {
    alias: {
      react: 'preact/compat',
      'react-dom/test-utils': 'preact/test-utils',
      'react-dom': 'preact/compat', // Must be below test-utils
      'react/jsx-runtime': 'preact/jsx-runtime',
      utils: path.resolve(__dirname, 'components/utils/'),
    },
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'styles',
          type: 'css/mini-extract',
          chunks: 'all',
          enforce: true,
        },
      },
    },
    minimize: process.env.NODE_ENV === 'development' ? true : false,
    minimizer: [
      new TerserPlugin({
        // Stops license.txt files from generating
        terserOptions: {
          format: {
            comments: false,
          },
        },
        extractComments: false,
      }),
    ],
  },
  output: {
    clean: true,
    path: path.resolve(__dirname, 'assets'),
    chunkFilename: '[contenthash].js',
  },
};
