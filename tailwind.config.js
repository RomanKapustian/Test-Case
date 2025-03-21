/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./components/**/*.js', './components/**/*.liquid'],
  theme: {
    container: {
      center: true,
      screens: {
        DEFAULT: 'none',
      },
    },
    fontFamily: {
      bebas: ['Bebas', 'sans-serif'],
      sspro: ['SSPro', 'sans-serif'],
      poppins: ['Poppins Medium', 'sans-serif'],
    },
    screens: {
      tablet: '690px',
      // => @media (min-width: 690px) { ... }
      laptop: '1024px',
      // => @media (min-width: 1024px) { ... }
      desktop: '1280px',
      // => @media (min-width: 1280px) { ... }
      wide: '1400px',
      // => @media (min-width: 1400px) { ... }
    },
    colors: {
      default: '#231F20',
      gray: '#DDD6D7',
      graylight: '#707070',
      black: '#000000',
      white: '#ffffff',
    },
    backgroundColor: {
      default: '#231F20',
      gray: '#DDD6D7',
      graylight: '#707070',
      black: '#000000',
      white: '#ffffff',
    },
    extend: {
      maxWidth: {
        panel: '18.75rem',
        container: '1650px',
        pcard: '355px',
      },
      width: {
        pcard: '355px',
      },
      fontSize: {
        heading2: '40px',
      },
      space: {
        75: '75px',
        30: '30px',
      },
      margin: {
        30: '30px',
      },
      gap: {
        15: '15px',
      },
      padding: {
        14: '14px',
        75: '75px',
      },
      gridTemplateRows: {
        auto: 'auto',
      },
      gridTemplateColumns: {
        max: 'max-content',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
