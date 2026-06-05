import styled from '@emotion/styled';
import ProductCard from '../Product/ProductCard';
import OrderCountStepper from './OrderCountStepper';
import CheckBox from '../CheckBox/CheckBox';
import CartItem from './CartItem';
import type { CartItemType } from '../../types/product.types';

interface Props {
  cartItems: CartItemType[];
  selectedIds: Set<number>;
  onSelect: (id: number, isSelected: boolean) => void;
  onSelectAll: () => void;
  onDecrease: (id: number) => void;
  onIncrease: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function CartItemList({
  cartItems,
  selectedIds,
  onSelect,
  onSelectAll,
  onDecrease,
  onIncrease,
  onDelete,
}: Props) {
  return (
    <Container>
      <SelectAll>
        <CheckBox
          isSelected={cartItems.length === selectedIds.size}
          onSelect={onSelectAll}
        />
        <span>전체선택</span>
      </SelectAll>

      {cartItems.map((product) => (
        <CartItem
          key={product.id}
          isSelected={selectedIds.has(product.id)}
          onSelect={(isSelected) => onSelect(product.id, isSelected)}
          onDelete={() => onDelete(product.id)}
        >
          <ProductCard
            data={product}
            action={
              <OrderCountStepper
                orderCount={product.orderCount}
                onDecrease={() => onDecrease(product.id)}
                onIncrease={() => onIncrease(product.id)}
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
