import { h, createContext } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import Storefront from 'utils/storefront';
import * as queries from 'utils/storefront/queries';
import { formatCart } from 'utils/storefront/format-resource';

const Context = createContext();

const CartContext = ({ children }) => {
  console.log(window.TMW);
  const storefront = Storefront.getInstance();
  const [cartState, setCartState] = useState({
    id: null,
    subtotal: { amount: 0, currencyCode: window.TMW.localization.currencyCode },
    lines: [],
  });
  const handleExternalAddToCart = (e) => cart.add(e.detail.payload);
  const openCartEvent = new CustomEvent('cart:open');

  useEffect(async () => {
    let initialCart = await getCart(localStorage.getItem('TMW.cartToken'));
    if (initialCart) return setCartState(initialCart);
    initialCart = await createCart();
    return setCartState(initialCart);
  }, []);

  useEffect(() => {
    if (cartState.id) {
      // Setup cart events for components outside of this context
      document.addEventListener('cart:add', handleExternalAddToCart);

      const cartCountEl = document.querySelector('[data-cart-count]');
      cartCountEl.textContent = cartState?.totalQuantity || 0;
    }

    // Cleanup
    return () =>
      document.removeEventListener('cart:add', handleExternalAddToCart);
  }, [cartState]);

  /**
   * Gets a cart instance from a cart ID
   * @param {string} id cart id
   * @returns formatted cart object
   */
  const getCart = async (id) => {
    const response = await storefront.request({
      query: queries.cartBuyerIdentityUpdate,
      variables: {
        cartId: id,
        buyerIdentity: {
          countryCode: window.TMW.localization.countryCode,
        },
      },
    });

    if (response?.data?.cartBuyerIdentityUpdate.cart)
      return formatCart(response.data.cartBuyerIdentityUpdate.cart);
    // Remove old ID from localStorage
    localStorage.removeItem('TMW.cartToken');
    return null;
  };

  /**
   * Creates a new cart instance
   * @returns formatted cart object
   */
  const createCart = async () => {
    const response = await storefront.request({
      query: queries.cartCreate,
      variables: {
        input: {
          buyerIdentity: {
            countryCode: window.TMW.localization.countryCode,
          },
        },
      },
    });

    if (response?.data?.cartCreate?.cart) {
      const { cart } = response.data.cartCreate;
      // Store ID in localStorage for future use
      localStorage.setItem('TMW.cartToken', cart.id);
      return formatCart(cart);
    }

    return null;
  };

  /**
   * Method for handling all cart requests (add/remove/update)
   * @param {array} lines
   * @param {array} lineIds
   * @param {string} query
   * @returns cart object (stored in state)
   */
  const updateCartLines = async ({
    lines,
    lineIds,
    query,
    isBackgroundJob = false,
  }) => {
    const response = await storefront.request({
      query: queries[query],
      variables: {
        cartId: cartState.id,
        ...(lines && { lines }),
        ...(lineIds && { lineIds }),
        countryCode: window.TMW.localization.countryCode,
      },
    });

    // eslint-disable-next-line no-console
    if (response.errors) console.error(response.errors);
    const updatedCart = formatCart(response.data[query].cart);
    const zeroQuantityItems = updatedCart.lines.filter(
      (line) => line.quantity === 0,
    );

    // Remove zero quantity items
    if (zeroQuantityItems.length)
      cart.remove(
        zeroQuantityItems.map((line) => line.id),
        true,
      );

    // Update cart
    if (!isBackgroundJob) {
      setCartState(updatedCart);
      document.dispatchEvent(openCartEvent);
    }
  };

  /**
   * Formats line items for storefront API
   * @param {array|object} payload of line items to add or update
   * @returns payload formatted for the storefront API
   */
  const formatCartUpdatePayload = (payload, updateType) => {
    if (!payload || !updateType) return [];
    const payloadArray = Array.isArray(payload) ? payload : [payload];

    if (updateType === 'add') {
      return payloadArray.map((line) => {
        const merchandiseId = line.merchandiseId
          ? line.merchandiseId
          : `gid://shopify/ProductVariant/${line.id}`;
        // eslint-disable-next-line no-param-reassign
        delete line.id;
        return {
          ...line,
          ...(merchandiseId && { merchandiseId }),
        };
      });
    }

    return payloadArray;
  };

  /**
   * Wrapper for cart API to make interactions more simple
   */
  const cart = {
    add: (payload, isBackgroundJob) =>
      updateCartLines({
        lines: formatCartUpdatePayload(payload, 'add'),
        query: 'cartLinesAdd',
        isBackgroundJob,
      }),
    remove: (payload, isBackgroundJob) =>
      updateCartLines({
        lineIds: formatCartUpdatePayload(payload, 'remove'),
        query: 'cartLinesRemove',
        isBackgroundJob,
      }),
    update: (payload, isBackgroundJob) =>
      updateCartLines({
        lines: formatCartUpdatePayload(payload, 'update'),
        query: 'cartLinesUpdate',
        isBackgroundJob,
      }),
    state: cartState,
  };

  return <Context.Provider value={{ cart }}>{children}</Context.Provider>;
};

export const withCartContext = (Rendered) => (props) =>
  (
    <Context.Consumer>
      {(value) => <Rendered {...props} {...value} />}
    </Context.Consumer>
  );

export default CartContext;
