import { randomBytes } from "crypto";

/** Token URL-safe, ~172 bit entropi */
export function generateTableOrderSecret() {
  return randomBytes(22).toString("base64url");
}

export function getOrderTokenExpiryDate(hoursFromNow) {
  const h = typeof hoursFromNow === "number" && hoursFromNow > 0 ? hoursFromNow : 4;
  return new Date(Date.now() + h * 60 * 60 * 1000);
}
