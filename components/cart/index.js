import { h, render } from 'preact';
import CartContext from './cart-context';
import Cart from './cart';

export default (element, data) => {
  const renderCart = () => {
    render(
      <CartContext data={data}>
        <Cart />
      </CartContext>,
      element,
    );
  };

  const init = () => {
    renderCart();
  };

  init();
};
