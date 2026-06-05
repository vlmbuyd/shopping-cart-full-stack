import { render, screen, fireEvent } from '@testing-library/react';
import CartPage from './CartPage';

/**
 * CheckBox 컴포넌트는 별도의 라벨이 없고, 선택 여부에 따라
 * alt="checkIcon"(선택됨) / alt="unCheckIcon"(선택 안 됨) 아이콘을 렌더링한다.
 * 이를 이용해 체크박스 버튼들을 DOM 순서대로 가져온다.
 * 순서: [0] 전체 선택, [1] 상품이름A, [2] 상품이름B
 */
const getCheckboxes = () =>
  screen
    .getAllByAltText(/^(checkIcon|unCheckIcon)$/)
    .map((img) => img.closest('button') as HTMLButtonElement);

const isChecked = (checkbox: HTMLButtonElement) =>
  checkbox.querySelector('img')?.getAttribute('alt') === 'checkIcon';

beforeEach(() => {
  localStorage.clear();
});

describe('CartPage 전체 선택 기능', () => {
  it('전체 선택 체크박스를 해제하면 모든 상품이 해제된다', () => {
    // 초기 상태: localStorage가 비어 있으면 모든 상품이 선택되어 있다
    render(<CartPage />);

    const [selectAll, itemA, itemB] = getCheckboxes();
    expect(isChecked(selectAll)).toBe(true);
    expect(isChecked(itemA)).toBe(true);
    expect(isChecked(itemB)).toBe(true);

    // 전체 선택 체크박스를 해제한다
    fireEvent.click(getCheckboxes()[0]);

    // 개별 체크박스가 전부 해제된다
    const [selectAllAfter, ...itemsAfter] = getCheckboxes();
    expect(isChecked(selectAllAfter)).toBe(false);
    itemsAfter.forEach((item) => expect(isChecked(item)).toBe(false));
  });

  it('개별 상품을 모두 선택하면 전체 선택 체크박스가 활성화된다', () => {
    // 아무 상품도 선택되지 않은 상태에서 시작한다
    localStorage.setItem('selectedCartIds', JSON.stringify([]));
    render(<CartPage />);

    expect(isChecked(getCheckboxes()[0])).toBe(false);

    // 상품을 하나만 선택하면 전체 선택은 아직 활성화되지 않는다
    fireEvent.click(getCheckboxes()[1]);
    expect(isChecked(getCheckboxes()[0])).toBe(false);

    // 나머지 상품까지 모두 선택하면 전체 선택 체크박스가 활성화된다
    fireEvent.click(getCheckboxes()[2]);
    expect(isChecked(getCheckboxes()[0])).toBe(true);
  });
});
