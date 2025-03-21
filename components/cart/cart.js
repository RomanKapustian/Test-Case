import { h } from 'preact';
import { useState, useRef, useEffect } from 'preact/hooks';
import Panel from 'utils/panel';
import { formatMoney } from 'utils/storefront/format-resource';
import { withCartContext } from './cart-context';
import CartItem from './cart-item';

const Cart = (props) => {
  const { cart } = props;
  const closeTriggerEl = useRef(null);
  const isCartRedirect = new URLSearchParams(window.location.search).get(
    'cart',
  );
  const [panelTriggers, setPanelTriggers] = useState({
    openTriggerEl: document.querySelector('[data-header-cart-trigger]'),
    closeTriggerEl: null,
  });

  useEffect(() => {
    if (!closeTriggerEl.current) return;
    setPanelTriggers((value) => ({
      ...value,
      closeTriggerEl: closeTriggerEl.current,
    }));
  }, [closeTriggerEl]);

  return (
    <Panel triggers={panelTriggers} defaultOpen={isCartRedirect} context="cart">
      <div>
        <div>
          <button type="button" ref={closeTriggerEl}>
            {window.TMW.Strings.cart.close}
          </button>
        </div>
        <div>
          {cart?.state?.lines?.map((line) => (
            <CartItem key={line.id} line={line} />
          ))}
        </div>
        <div>
          <span>{formatMoney(cart.state.subtotal)}</span>
          <a
            className="justify-center w-full button button--primary"
            href={cart.state.checkoutUrl}
          >
            {window.TMW.Strings.cart.checkout}
          </a>
        </div>
      </div>
    </Panel>
  );
};

export default withCartContext(Cart);
