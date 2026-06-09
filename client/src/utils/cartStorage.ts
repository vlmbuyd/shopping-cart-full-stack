import type { CartItemType } from '../types/product.types';

export const saveSelectedIds = (ids: number[]): void =>
  localStorage.setItem('selectedCartIds', JSON.stringify([...ids]));

export const isAllSelected = (
  cartItems: CartItemType[],
  selectedIds: Set<number>,
) => cartItems.every((item) => selectedIds.has(item.id));
