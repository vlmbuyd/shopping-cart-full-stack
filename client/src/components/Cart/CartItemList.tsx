import styled from '@emotion/styled';
import ProductCard from '../Product/ProductCard';
import OrderCountStepper from './OrderCountStepper';
import CheckBox from '../CheckBox/CheckBox';
import CartItem from './CartItem';
import type { CartItemType } from '../../types/product.types';
import { isAllSelected } from '../../utils/cartStorage';

interface Props {
  cartItems: CartItemType[];
  selectedIds: Set<number>;
  onSelect: (id: number, isSelected: boolean) => void;
  onSelectAll: () => void;
  onUpdate: (id: number, orderCount: number, delta: 1 | -1) => void;
  onDelete: (id: number) => void;
}

export default function CartItemList({
  cartItems,
  selectedIds,
  onSelect,
  onSelectAll,
  onUpdate,
  onDelete,
}: Props) {
  return (
    <Container>
      <SelectAll>
        <CheckBox
          isSelected={isAllSelected(cartItems, selectedIds)}
          onSelect={onSelectAll}
        />
        <span>전체선택</span>
      </SelectAll>

      {cartItems.map((cartItem) => (
        <CartItem
          key={cartItem.id}
          isSelected={selectedIds.has(cartItem.id)}
          onSelect={(isSelected) => onSelect(cartItem.id, isSelected)}
          onDelete={() => onDelete(cartItem.id)}
        >
          <ProductCard
            data={cartItem}
            action={
              <OrderCountStepper
                orderCount={cartItem.orderCount}
                onDecrease={() =>
                  onUpdate(cartItem.id, cartItem.orderCount, -1)
                }
                onIncrease={() =>
                  onUpdate(cartItem.id, cartItem.orderCount, +1)
                }
              />
            }
          />
        </CartItem>
      ))}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 52px;
`;

const SelectAll = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  span {
    font-size: 12px;
    font-weight: 500;
    color: #0a0d13;
  }
`;
