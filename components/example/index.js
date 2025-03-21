import './example.css';

/**
 * element: DOM node representing the component
 * data: info scraped from element with data-section-data attribute. This should be an application/json type script tag.
 * data.layout: access to the media query utility
 *
 * Architecture within each component is very flexible, but let's try to keep it as functional as possible.
 *
 * Note: this component can listen for breakpoint changes, emitted via utils\layout.js, and handle with handleBpChange() below
 */

// eslint-disable-next-line no-unused-vars
export default (element, data) => {
  const handleBpChange = (e) => {
    // eslint-disable-next-line no-console
    console.log('current bp: ', e.detail.bp);
  };

  const init = () => {
    window.addEventListener('bpChange', handleBpChange);
  };

  init();
};
