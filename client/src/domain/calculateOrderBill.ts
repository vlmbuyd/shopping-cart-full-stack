import type { CartItemType } from '../types/product.types';

export const calculateOrderBill = (
  cartItems: CartItemType[],
  selectedIds: Set<number>,
) => {
  const selectedCartItems = cartItems.filter((item) =>
    selectedIds.has(item.id),
  );

  const orderPrice = calculateOrderPrice(selectedCartItems);
  const shippingFee = calculateShippingFee(orderPrice);

  return {
    orderPrice,
    shippingFee,
    totalPrice: orderPrice + shippingFee,
  };
};

export const calculateOrderPrice = (cartItems: CartItemType[]) =>
  cartItems.reduce((acc, curr) => acc + curr.price * curr.orderCount, 0);

const FREE_SHIPPING_THRESHOLD = 100000;
const DEFAULT_SHIPPING_FEE = 3000;

export const calculateShippingFee = (orderPrice: number) =>
  orderPrice >= FREE_SHIPPING_THRESHOLD ? 0 : DEFAULT_SHIPPING_FEE;
