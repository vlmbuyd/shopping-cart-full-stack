import {
  getOrderCountState,
  MAX_ORDER_COUNT,
  MIN_ORDER_COUNT,
} from './orderCount';

describe('getOrderCountState', () => {
  it('수량이 99일 때 증가 불가 상태임을 반환한다', () => {
    expect(getOrderCountState(MAX_ORDER_COUNT).canIncrease).toBe(false);
  });

  it('수량이 1일 때 감소 불가 상태임을 반환한다', () => {
    expect(getOrderCountState(MIN_ORDER_COUNT).canDecrease).toBe(false);
  });

  it('수량이 1보다 크면 감소 가능 상태임을 반환한다', () => {
    expect(getOrderCountState(2).canDecrease).toBe(true);
  });

  it('수량이 99보다 작으면 증가 가능 상태임을 반환한다', () => {
    expect(getOrderCountState(98).canIncrease).toBe(true);
  });
});
