import { Coupon } from '../../model/Coupon.js';

export const MAX_SELECTABLE_COUPONS = 2;

export type DiscountContext = {
  orderItems: { price: number; orderCount: number }[];

  // 쿠폰 적용 전 주문 금액
  orderPrice: number;

  // 기본 + 도서산간 배송비
  shippingFee: number;

  // 만료일/사용시간 판정 기준 시각
  now: Date;
};

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}
function formatTime(date: Date): string {
  return date.toTimeString().slice(0, 5);
}

/** 만료일, 최소주문금액, 사용시간 조건을 만족하지 못하면 true */
export function isCouponDisabled(coupon: Coupon, context: DiscountContext) {
  const { now, orderPrice } = context;

  if (formatDate(now) > coupon.dueDate) return true;
  if (orderPrice < coupon.minOrderAmount) return true;

  const { startTime, endTime } = coupon.availableTime;
  if (startTime && endTime) {
    const current = formatTime(now);
    if (current < startTime || current > endTime) return true;
  }

  return false;
}

/** 주문 금액을 깎는 정액 쿠폰(FIXED, BOGO)의 할인액 */
function fixedDiscount(coupon: Coupon, context: DiscountContext): number {
  if (coupon.type === 'FIXED') return coupon.value;

  if (coupon.type === 'BOGO') {
    const target = context.orderItems.filter((item) => item.orderCount >= 3);
    if (target.length === 0) return 0;

    return Math.max(...target.map((item) => item.price));
  }

  return 0;
}

/** 선택한 쿠폰들의 총 할인 금액 */
export function calculateCouponsDiscount(
  coupons: Coupon[],
  context: DiscountContext,
): number {
  const { orderPrice, shippingFee } = context;

  const fixedSum = coupons.reduce(
    (sum, coupon) => sum + fixedDiscount(coupon, context),
    0,
  );
  const reducedOrderPrice = Math.max(0, orderPrice - fixedSum);

  const percentageSum = coupons
    .filter((coupon) => coupon.type === 'PERCENTAGE')
    .reduce(
      (sum, coupon) =>
        sum + Math.floor((reducedOrderPrice * coupon.value) / 100),
      0,
    );

  const shippingSum = coupons.some((coupon) => coupon.type === 'FREE_SHIPPING')
    ? shippingFee
    : 0;

  return fixedSum + percentageSum + shippingSum;
}

/** 쿠폰 조합하기*/
function combinations<T>(items: T[], size: number): T[][] {
  if (size === 0) return [[]];
  if (items.length < size) return [];

  const [first, ...rest] = items;
  const withFirst = combinations(rest, size - 1).map((combo) => [
    first,
    ...combo,
  ]);
  const withoutFirst = combinations(rest, size);

  return [...withFirst, ...withoutFirst];
}

/**
 * 사용 가능한 쿠폰들 중 할인 효과가 가장 큰 조합(최대 2개)을 반환
 * 적용 불가 쿠폰은 후보에서 제외
 */
export function findBestCouponCombination(
  coupons: Coupon[],
  context: DiscountContext,
): Coupon[] {
  const usable = coupons.filter((coupon) => !isCouponDisabled(coupon, context));
  const candidates = Array.from(
    { length: MAX_SELECTABLE_COUPONS },
    (_, index) => combinations(usable, index + 1),
  ).flat();

  let best: Coupon[] = [];
  let bestDiscount = 0;

  candidates.forEach((combo) => {
    const discount = calculateCouponsDiscount(combo, context);
    if (discount > bestDiscount) {
      bestDiscount = discount;
      best = combo;
    }
  });

  return best;
}
