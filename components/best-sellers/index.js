import './best-sellers.css';

/**
 * element: DOM node representing the component
 * data: info scraped from element with data-section-data attribute. This should be an application/json type script tag.
 * data.layout: access to the media query utility
 *
 * Architecture within each component is very flexible, but let's try to keep it as functional as possible.
 *
 */

// eslint-disable-next-line no-unused-vars
export default (element, data) => {
  const init = () => {
    const buttonShow = element.querySelector('[data-show-products]');
    if (buttonShow && buttonShow !== undefined) {
      buttonShow.addEventListener('click', (e) => {
        e.preventDefault();
        element.querySelectorAll('.mobile-hide-product').forEach((product) => {
          product.classList.remove('mobile-hide-product');
        });
        buttonShow.classList.add('mobile-hide-button');
      });
    }
  };

  init();
};
