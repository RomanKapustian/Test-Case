import { h } from 'preact';
import { useMemo } from 'preact/hooks';
import { withCartContext } from './cart-context';

const CartItem = (props) => {
  const { cart, line } = props;
  let maxQuantity = line.merchandise.quantityAvailable;

  if (line.children) {
    // If bundle, get lowest child quantity
    maxQuantity = line.children.reduce(
      (prevQuantity, child) =>
        prevQuantity < child.merchandise.quantityAvailable
          ? prevQuantity
          : child.merchandise.quantityAvailable,
      10000,
    );
  }

  const handleAdjustQuantity = (quantity) => {
    const qty = quantity > maxQuantity ? maxQuantity : quantity;
    let payload = [
      {
        id: line.id,
        quantity: qty,
      },
    ];

    // If bundle, add children to update request
    if (line.children) {
      payload = line.children.map((child) => ({
        id: child.id,
        attributes: child.attributes,
        quantity: qty,
      }));
    }

    return cart.update(payload);
  };

  const handleRemove = () => {
    let payload = [line.id];

    // If bundle, add children to update request
    if (line.children) {
      payload = line.children.map((child) => child.id);
    }

    return cart.remove(payload);
  };

  const lineItem = useMemo(
    () => (
      <div key={line.id}>
        <p>
          <a href={`/products/${line.merchandise.product.handle}`}>
            {line.merchandise.product.title}
          </a>
        </p>
        <div>
          <button
            onClick={() => handleAdjustQuantity(line.quantity - 1)}
            aria-label={window.TMW.Strings.cart.remove}
          >
            &#8722;
          </button>
          <input
            type="number"
            value={line.quantity}
            onBlur={(e) => handleAdjustQuantity(parseInt(e.target.value, 10))}
            max={maxQuantity}
          />
          <button
            onClick={() => handleAdjustQuantity(line.quantity + 1)}
            aria-label={window.TMW.Strings.cart.add}
          >
            &#43;
          </button>
        </div>
        <button onClick={() => handleRemove()}>
          {window.TMW.Strings.cart.remove}
        </button>
      </div>
    ),
    [line],
  );

  return lineItem;
};

export default withCartContext(CartItem);
