import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import Modal from '../Modal';
import CouponItem from './CouponItem';
import infoIcon from '../../assets/info.svg';
import { useQuery } from '../../api/useQuery';
import {
  getCouponsDiscount,
  getOrderCoupons,
  updateOrderCoupons,
} from '../../api/coupon';
import { formatPrice } from '../../utils/formatPrice';

const MAX_SELECTABLE_COUPONS = 2;

interface CouponSelectModalProps {
  orderId: number;
  onClose: () => void;
  onApplied: () => void;
}

export default function CouponSelectModal({
  orderId,
  onClose,
  onApplied,
}: CouponSelectModalProps) {
  const { data } = useQuery({
    queryFn: () => getOrderCoupons(orderId),
  });
  const coupons = data?.result.coupons ?? [];

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isApplying, setIsApplying] = useState(false);

  const [initializedData, setInitializedData] = useState(data);

  if (data && data !== initializedData) {
    setInitializedData(data);
    setSelectedIds(
      data.result.coupons
        .filter((coupon) => coupon.isSelected)
        .map((c) => c.id),
    );
  }

  useEffect(() => {
    if (!data) return;

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
  }, [orderId, selectedIds, data]);

  const handleToggle = (id: number) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((value) => value !== id);
      if (prev.length >= MAX_SELECTABLE_COUPONS) {
        alert(
          `쿠폰은 최대 ${MAX_SELECTABLE_COUPONS}개까지 사용할 수 있습니다.`,
        );
        return prev;
      }
      return [...prev, id];
    });
  };

  const handleApply = async () => {
    try {
      setIsApplying(true);
      await updateOrderCoupons(orderId, selectedIds);
      onApplied();
      onClose();
    } catch (err) {
      if (err instanceof Error) alert(err.message);
    } finally {
      setIsApplying(false);
    }
  };

  const applyLabel =
    discountAmount > 0
      ? `총 ${formatPrice(discountAmount)}원 할인 쿠폰 사용하기`
      : '쿠폰 적용하기';

  return (
    <Modal
      isOpen
      onClose={onClose}
      title="쿠폰을 선택해 주세요"
      footer={
        <ApplyButton type="button" onClick={handleApply} disabled={isApplying}>
          {applyLabel}
        </ApplyButton>
      }
    >
      <InfoBanner>
        <img src={infoIcon} alt="" aria-hidden="true" />
        쿠폰은 최대 {MAX_SELECTABLE_COUPONS}개까지 사용할 수 있습니다.
      </InfoBanner>

      <List>
        {coupons.map((coupon) => (
          <CouponItem
            key={coupon.id}
            coupon={coupon}
            isSelected={selectedIds.includes(coupon.id)}
            onToggle={handleToggle}
          />
        ))}
      </List>
    </Modal>
  );
}

const InfoBanner = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding-bottom: 16px;
  border-bottom: 1px solid #0000001a;
  font-size: 14px;
  font-weight: 500;
  color: #0a0d13;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
`;

const ApplyButton = styled.button`
  width: 100%;
  height: 56px;
  border-radius: 5px;
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  background-color: #333333;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
