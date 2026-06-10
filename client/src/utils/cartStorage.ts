export const saveSelectedIds = (ids: number[]): void =>
  localStorage.setItem('selectedCartIds', JSON.stringify([...ids]));

export const isAllSelected = (cartItems: number[], selectedIds: Set<number>) =>
  cartItems.every((id) => selectedIds.has(id));
