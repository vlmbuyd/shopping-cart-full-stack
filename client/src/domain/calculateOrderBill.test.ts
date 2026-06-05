import { calculateOrderBill } from './calculateOrderBill';
import type { CartItemType } from '../types/product.types';

const createCartItem = (overrides: Partial<CartItemType> = {}): CartItemType => ({
  id: 1,
  name: '상품',
  price: 10000,
  imgUrl: '',
  orderCount: 1,
  ...overrides,
});

describe('calculateOrderBill', () => {
  it('선택된 상품들의 주문금액 합계를 계산한다', () => {
    const cartItems: CartItemType[] = [
      createCartItem({ id: 1, price: 10000, orderCount: 2 }),
      createCartItem({ id: 2, price: 5000, orderCount: 3 }),
    ];
    const selectedIds = new Set([1, 2]);

    const { orderPrice } = calculateOrderBill(cartItems, selectedIds);

    expect(orderPrice).toBe(10000 * 2 + 5000 * 3);
  });

  it('선택 해제된 상품은 주문금액에 포함되지 않는다', () => {
    const cartItems: CartItemType[] = [
      createCartItem({ id: 1, price: 10000, orderCount: 2 }),
      createCartItem({ id: 2, price: 5000, orderCount: 3 }),
    ];
    const selectedIds = new Set([1]);

    const { orderPrice } = calculateOrderBill(cartItems, selectedIds);

    expect(orderPrice).toBe(10000 * 2);
  });

  it('주문금액이 100,000원 미만이면 배송비가 부과된다', () => {
    const cartItems: CartItemType[] = [
      createCartItem({ id: 1, price: 99000, orderCount: 1 }),
    ];
    const selectedIds = new Set([1]);

    const { shippingFee } = calculateOrderBill(cartItems, selectedIds);

    expect(shippingFee).toBe(3000);
  });

  it('주문금액이 100,000원 이상이면 배송비가 무료이다', () => {
    const cartItems: CartItemType[] = [
      createCartItem({ id: 1, price: 100000, orderCount: 1 }),
    ];
    const selectedIds = new Set([1]);

    const { shippingFee } = calculateOrderBill(cartItems, selectedIds);

    expect(shippingFee).toBe(0);
  });
});
