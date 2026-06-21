import {
  calculateOrderPrice,
  calculateShippingFee,
} from '../domain/payment/payment.calculator.js';

describe('주문 금액 계산 (calculateOrderPrice)', () => {
  test('각 상품의 (단가 × 주문수량) 합을 반환한다.', () => {
    const orderPrice = calculateOrderPrice([
      { price: 5000, orderCount: 2 },
      { price: 10000, orderCount: 1 },
    ]);

    expect(orderPrice).toBe(20000);
  });

  test('상품이 없으면 0을 반환한다.', () => {
    expect(calculateOrderPrice([])).toBe(0);
  });
});

describe('배송비 계산 (calculateShippingFee)', () => {
  test('주문 금액이 100,000원 이상이면 무료(0원)다.', () => {
    expect(calculateShippingFee(100000)).toBe(0);
  });

  test('주문 금액이 100,000원 미만이면 3,000원이다.', () => {
    expect(calculateShippingFee(99999)).toBe(3000);
  });

  test('주문 금액이 0원이면 배송비도 0원이다.', () => {
    expect(calculateShippingFee(0)).toBe(0);
  });
});
