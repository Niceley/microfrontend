// Contrat d'événements :
//
//   PRODUCT_ADDED  { id, name, price, emoji, genre }
//     → émis par mfe-product, écouté par mfe-cart
//
//   CART_UPDATED   { items, total, count }
//     → émis par mfe-cart, écouté par shell (badge) et mfe-reco
//
// Implémentation via window CustomEvent :
// tous les MFEs partagent le même window → les événements traversent les bundles.

const EventBus = {
  on(event, handler) {
    const wrapper = (e) => handler(e.detail);
    window.addEventListener(event, wrapper);
    return wrapper; // retourner pour pouvoir appeler off() dans le cleanup
  },

  off(event, handler) {
    window.removeEventListener(event, handler);
  },

  emit(event, data) {
    window.dispatchEvent(new CustomEvent(event, { detail: data }));
  },
};

export default EventBus;
