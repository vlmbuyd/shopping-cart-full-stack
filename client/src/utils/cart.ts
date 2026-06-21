import type { CartItemType } from '../types/product.types';

export const isAllCartItemsSelected = (items: CartItemType[]) =>
  items.length > 0 && items.every((i) => i.isSelected);
