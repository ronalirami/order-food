/** Event untuk membuka drawer keranjang di halaman `/order` (mobile). Listener hanya dipasang saat QR meja sah. */
export const OPEN_ORDER_MOBILE_CART_EVENT = "lb-open-order-mobile-cart";

export function requestOpenOrderMobileCart() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(OPEN_ORDER_MOBILE_CART_EVENT));
}
