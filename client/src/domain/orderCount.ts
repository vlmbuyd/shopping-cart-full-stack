export const MIN_ORDER_COUNT = 1;
export const MAX_ORDER_COUNT = 99;

export const getOrderCountState = (orderCount: number) => ({
  canDecrease: orderCount > MIN_ORDER_COUNT,
  canIncrease: orderCount < MAX_ORDER_COUNT,
});
