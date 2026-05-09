/**
 * Satu flag untuk server + UI: set "false" agar QR meja tidak diganti otomatis setelah lunas (alami Joyfull).
 * Default (kosong / true) = putar token setiap lunas seperti sebelumnya.
 */
export function shouldRotateOrderQrAfterPayment() {
  const v = process.env.NEXT_PUBLIC_ROTATE_ORDER_QR_AFTER_PAYMENT;
  if (v === undefined || v === "") return true;
  return v === "1" || v.toLowerCase() === "true";
}
