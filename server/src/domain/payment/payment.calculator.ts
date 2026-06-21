export const FREE_SHIPPING_THRESHOLD = 100_000;
export const DEFAULT_SHIPPING_FEE = 3_000;

type PriceableItem = {
  price: number;
  orderCount: number;
};

export function calculateOrderPrice(items: PriceableItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.orderCount, 0);
}
export function calculateShippingFee(orderPrice: number): number {
  if (orderPrice === 0) return 0;
  return orderPrice >= FREE_SHIPPING_THRESHOLD ? 0 : DEFAULT_SHIPPING_FEE;
}
