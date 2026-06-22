import { useEffect, useState } from 'react';
import { getCouponsDiscount } from '../api/coupon';

interface UseCouponDiscountPreviewOptions {
  orderId: number;
  selectedIds: number[];
  enabled: boolean;
}

export const useCouponDiscountPreview = ({
  orderId,
  selectedIds,
  enabled,
}: UseCouponDiscountPreviewOptions) => {
  const [discountAmount, setDiscountAmount] = useState(0);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;
    getCouponsDiscount(orderId, selectedIds)
      .then((res) => {
        if (!cancelled) setDiscountAmount(res.result.discountAmount);
      })
      .catch(() => {
        if (!cancelled) setDiscountAmount(0);
      });

    return () => {
      cancelled = true;
    };
  }, [orderId, selectedIds, enabled]);

  return discountAmount;
};
