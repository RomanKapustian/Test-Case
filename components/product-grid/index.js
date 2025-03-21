import { h, render } from 'preact';
import ProductGrid from './product-grid';

export default (element, data) => {
  const init = () => {
    render(<ProductGrid {...data} />, element);
  };

  init();
};
