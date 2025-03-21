module.exports = {
  plugins: {
    'postcss-preset-env': {},
    tailwindcss: {
      config: './tailwind.config.js',
    },
    autoprefixer: {},
    ...(process.env.NODE_ENV === 'production' ? { cssnano: {} } : {}),
  },
};
