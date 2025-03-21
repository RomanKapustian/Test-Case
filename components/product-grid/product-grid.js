import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import Storefront from 'utils/storefront';
import * as queries from 'utils/storefront/queries';
import ProductCard from 'utils/product-card';
import { edgesToNodes } from 'utils/storefront/format-resource';

const ProductGrid = (props) => {
  const storefront = Storefront.getInstance();
  const [products, setProducts] = useState(props.collection.products || []);

  const getCollection = async () => {
    const response = await storefront.request({
      query: queries.collectionGet,
      variables: {
        id: props.collection.id,
        first: 50,
      },
    });

    if (!response.data) {
      // eslint-disable-next-line no-console
      console.error(
        'product-grid/product-grid.js: Storefront API request failed',
        response,
      );
      return [];
    }

    return edgesToNodes(response.data.collection.products, 'product');
  };

  useEffect(() => {
    if (products.length) return;
    setProducts(getCollection());
  }, []);

  return (
    products.length && (
      <div className="grid grid-cols-2 gap-3 md:gap-5 md:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} {...props} />
        ))}
      </div>
    )
  );
};

export default ProductGrid;
