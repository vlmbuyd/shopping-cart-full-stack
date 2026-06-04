export const saveSelectedIds = (ids: number[]): void =>
  localStorage.setItem('selectedCartIds', JSON.stringify([...ids]));
