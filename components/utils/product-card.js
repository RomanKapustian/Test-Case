import { h } from 'preact';
import Image from 'utils/image';
import { formatMoney } from 'utils/storefront/format-resource';

const ProductCard = ({ product }) => {
  const url = `/products/${product.handle}`;

  return (
    <article className="relative group">
      <a className="relative block no-underline" href={url}>
        {product.images[0] && (
          <span>
            <Image {...product.images[0]} srcWidths={{ sm: 640 }} />
          </span>
        )}
        {product.images[1] && (
          <span className="absolute inset-0 invisible group-hover:visible">
            <Image
              {...product.images[1]}
              srcWidths={{ sm: 640 }}
              classes="object-cover h-full"
            />
          </span>
        )}
      </a>

      <h3>
        <a className="block" href={url}>
          {product.title}
        </a>
      </h3>

      <p>
        <span>{formatMoney(product.priceRange.minVariantPrice)}</span>
        {parseFloat(product.compareAtPriceRange.minVariantPrice.amount) > 0 && (
          <del>{formatMoney(product.compareAtPriceRange.minVariantPrice)}</del>
        )}
      </p>
    </article>
  );
};

export default ProductCard;
