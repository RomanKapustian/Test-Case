import { h, render } from 'preact';
import ProductGallery from './product-gallery';
import ProductForm from './product-form';
import BundleForm from './product-bundle-form';

export default (element, data) => {
  const Product = (props) => (
    <div className="grid grid-cols-2">
      <ProductGallery {...props} />
      {props.isBundle ? <BundleForm {...props} /> : <ProductForm {...props} />}
    </div>
  );

  const init = () => {
    render(<Product {...data} />, element);
  };

  init();
};
