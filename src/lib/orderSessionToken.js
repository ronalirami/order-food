/** Setelah token meja diverifikasi, simpan secret di tab ini agar /order bisa dibuka lagi tanpa ?t (mis. dari menu Order). */
export const ORDER_TABLE_TOKEN_STORAGE_KEY = "lamakbana_order_table_token_secret";

/** Event sama-tab ketika token tersimpan / dihapus (storage event tidak jalan untuk tab yang sama). */
export const ORDER_TOKEN_CHANGED_EVENT = "lb-order-token-changed";

/**
 * Path ke checkout dengan token meja dari sessionStorage (fallback `/order`).
 * Hanya aman dipanggil di client (browser).
 */
export function getOrderHref() {
  if (typeof window === "undefined") return "/order";
  try {
    const secret =
      typeof window.sessionStorage?.getItem === "function"
        ? sessionStorage.getItem(ORDER_TABLE_TOKEN_STORAGE_KEY)?.trim()
        : null;
    return secret ? `/order?t=${encodeURIComponent(secret)}` : "/order";
  } catch {
    return "/order";
  }
}
