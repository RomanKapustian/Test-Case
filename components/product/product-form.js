import { h } from 'preact';
import { formatMoney } from 'utils/storefront/format-resource';
import { useEffect, useMemo, useState } from 'preact/hooks';
import VariantSelector from './variant-selector';

const Price = ({ currentVariant }) => (
  <div>
    <span>{formatMoney(currentVariant.price)}</span>
    {parseFloat(currentVariant.compareAtPrice.amount) > 0 && (
      <del>{formatMoney(currentVariant.compareAtPrice)}</del>
    )}
  </div>
);

const AddToCartButton = ({ currentVariant }) => {
  const handleAddToCart = (e) => {
    e.preventDefault();

    const addToCartEvent = new CustomEvent('cart:add', {
      detail: {
        payload: {
          merchandiseId: currentVariant.id,
          quantity: 1,
        },
      },
    });
    document.dispatchEvent(addToCartEvent);
  };

  return (
    <button
      type="submit"
      className="button button--primary"
      disabled={!currentVariant.availableForSale}
      onClick={(e) => handleAddToCart(e)}
    >
      {currentVariant
        ? currentVariant?.availableForSale
          ? window.TMW.Strings.product.addToCart
          : window.TMW.Strings.product.outOfStock
        : window.TMW.Strings.product.unavailable}
    </button>
  );
};

const ProductForm = (props) => {
  // Lookup variant based on selected options
  const [currentVariant, setCurrentVariant] = useState(
    props.product.variants.find(
      (v) =>
        JSON.stringify(v.selectedOptions) ===
        JSON.stringify(props.product.variantBySelectedOptions.selectedOptions),
    ),
  );

  const variantSelectors = useMemo(
    () =>
      !props.product.hasOnlyDefaultVariant &&
      props.product.options.map((option) => (
        <VariantSelector
          currentVariant={currentVariant}
          key={option.name}
          option={option}
          setCurrentVariant={setCurrentVariant}
          variants={props.product.variants}
        />
      )),
    [],
  );

  const price = useMemo(
    () => <Price currentVariant={currentVariant} />,
    [currentVariant],
  );

  const addToCartButton = useMemo(
    () => <AddToCartButton currentVariant={currentVariant} />,
    [currentVariant],
  );

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const id = currentVariant.id.split('/ProductVariant/')[1];
    searchParams.set('variant', id);
    const newRelativePathQuery = `${
      window.location.pathname
    }?${searchParams.toString()}`;
    window.history.pushState(null, '', newRelativePathQuery);
  }, [currentVariant]);

  return (
    <form
      method="post"
      action="/cart/add"
      acceptCharset="UTF-8"
      encType="multipart/form-data"
      noValidate="novalidate"
      data-product-form
    >
      {price}
      {variantSelectors}
      {addToCartButton}
    </form>
  );
};

export default ProductForm;
