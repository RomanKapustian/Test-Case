import { h } from 'preact';
import { useEffect, useMemo, useState } from 'preact/hooks';
import { formatMoney } from 'utils/storefront/format-resource';
import Image from 'utils/image';
import VariantSelector from './variant-selector';

const BundleChild = (props) => {
  const [currentVariant, setCurrentVariant] = useState(
    props.product.variants.find((v) => v.availableForSale),
  );
  const [prevVariant, setPrevVariant] = useState(currentVariant);

  const variantSelectors = useMemo(
    () =>
      !props.product.hasOnlyDefaultVariant &&
      props.product.options.map((option) => (
        <VariantSelector
          currentVariant={currentVariant}
          key={option.id}
          option={option}
          variants={props.product.variants}
          setCurrentVariant={setCurrentVariant}
        />
      )),
    [],
  );

  useEffect(() => {
    const replaceVariant = props.bundle.activeVariants.findIndex(
      (v) => v.id === prevVariant.id,
    );
    const activeVariants = [...props.bundle.activeVariants];
    activeVariants.splice(replaceVariant, 1, currentVariant);
    props.setBundle((value) => ({
      ...value,
      activeVariants,
      available: activeVariants.every((v) => v.availableForSale),
    }));
    setPrevVariant(currentVariant);
  }, [currentVariant]);

  return (
    <div className="grid grid-cols-2">
      <Image {...props.product.images[0]} srcWidths={{ sm: 200, md: 400 }} />
      <div>
        <p>
          <a href={`/products/${props.product.handle}`}>
            {props.product.title}
          </a>{' '}
          - {formatMoney(currentVariant.price)}
        </p>
        {variantSelectors}
      </div>
    </div>
  );
};

export default BundleChild;
