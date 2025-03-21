import { h } from 'preact';
import { useEffect, useMemo, useState } from 'preact/hooks';
import Storefront from 'utils/storefront';
import * as queries from 'utils/storefront/queries';
import { formatBundle, formatMoney } from 'utils/storefront/format-resource';
import BundleChild from './product-bundle-child';

const Price = ({ variant, value }) => (
  <div>
    <span>{formatMoney(variant.price)}</span>
    {variant.compare_at_price && (
      <del>{formatMoney(variant.compareAtPrice)}</del>
    )}
    {value && (
      <span>
        ({window.TMW.Strings.bundle.value} {formatMoney(value)})
      </span>
    )}
  </div>
);

const BundleChildren = ({ bundle, setBundle }) => (
  <div>
    {bundle?.products?.map((product) => (
      <BundleChild
        key={product.id}
        bundle={bundle}
        product={product}
        setBundle={setBundle}
      />
    ))}
  </div>
);

const AddToCartButton = ({ bundle, bundleId, product, variant }) => {
  const handleAddToCart = (e) => {
    e.preventDefault();
    const bundleProductsId = `${
      variant.id.split('/ProductVariant/')[1]
    }/${bundle.activeVariants
      .map((v) => v.id.split('/ProductVariant/')[1])
      .join('/')}`;

    const addToCartEvent = new CustomEvent('cart:add', {
      detail: {
        payload: bundle.activeVariants.map((v) => ({
          merchandiseId: v.id,
          quantity: 1,
          attributes: [
            { key: '_bundleId', value: `${bundleId}` },
            { key: '_bundleProductsId', value: `${bundleProductsId}` },
            {
              key: '_bundleData',
              value: `${JSON.stringify({
                merchandise: {
                  product: {
                    handle: product.handle,
                    title: product.title,
                    image: product.images[0],
                  },
                },
                cost: {
                  totalAmount: product.priceRange.minVariantPrice,
                },
              })}`,
            },
          ],
        })),
      },
    });
    document.dispatchEvent(addToCartEvent);
  };

  return (
    <button
      type="submit"
      className="button button--primary"
      disabled={!bundle.available}
      onClick={(e) => handleAddToCart(e)}
    >
      {bundle.available
        ? window.TMW.Strings.product.addToCart
        : window.TMW.Strings.product.outOfStock}
    </button>
  );
};

const BundleForm = (props) => {
  const storefront = Storefront.getInstance();
  const [bundle, setBundle] = useState({});

  const getBundle = async (id) => {
    const response = await storefront.request({
      query: queries.bundleGet(props.product.id),
      variables: {
        id,
      },
    });

    if (response.errors) {
      // eslint-disable-next-line no-console
      console.error(response.errors);
      return {};
    }

    return formatBundle(response.data.products);
  };

  const price = useMemo(
    () => <Price variant={props.variant} value={bundle?.value} />,
    [bundle],
  );

  const bundleChildren = useMemo(
    () => <BundleChildren bundle={bundle} setBundle={setBundle} />,
    [bundle],
  );

  const addToCartButton = useMemo(
    () => (
      <AddToCartButton
        bundle={bundle}
        bundleId={props.product.id}
        product={props.product}
        variant={props.variant}
      />
    ),
    [bundle],
  );

  useEffect(() => {
    setBundle(getBundle());
  }, []);

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
      {bundleChildren}
      {addToCartButton}
    </form>
  );
};

export default BundleForm;
