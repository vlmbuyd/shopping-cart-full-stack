import { useEffect, useState } from 'react';
import { isAllSelected, saveSelectedIds } from '../utils/cartStorage';

export const useCartItemSelect = (cartItemIds: number[]) => {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(() => {
    const saved = localStorage.getItem('selectedCartIds');
    return saved !== null
      ? new Set<number>(JSON.parse(saved))
      : new Set<number>();
  });

  const cartItemKey = cartItemIds.join(',');

  useEffect(() => {
    if (cartItemIds.length === 0) return;

    const saved = localStorage.getItem('selectedCartIds');
    const hasSavedSelection = saved !== null && JSON.parse(saved).length > 0;
    if (hasSavedSelection) return;

    setSelectedIds(new Set(cartItemIds));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartItemKey]);

  const handleSelect = (id: number, isSelected: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (isSelected) next.add(id);
      else next.delete(id);

      saveSelectedIds([...next]);
      return next;
    });
  };

  const handleSelectAll = () => {
    setSelectedIds(() => {
      const next = new Set<number>();

      if (!isAllSelected(cartItemIds, selectedIds)) {
        cartItemIds.forEach((id) => {
          next.add(id);
        });
      }

      saveSelectedIds([...next]);
      return next;
    });
  };

  return {
    selectedIds,
    setSelectedIds,
    handleSelect,
    handleSelectAll,
  };
};
