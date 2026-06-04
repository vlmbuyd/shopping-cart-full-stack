import styled from '@emotion/styled';
import ProductCard from '../Product/ProductCard';
import QuantityStepper from './QuantityStepper';
import CheckBox from '../CheckBox/CheckBox';
import CartItem from './CartItem';
import type { CartItemType } from '../../types/product.types';

interface Props {
  cartItems: CartItemType[];
  selectedIds: Set<number>;
  onSelect: (id: number, isSelected: boolean) => void;
  onSelectAll: () => void;
  onDelete: () => void;
}

export default function CartItemList({
  cartItems,
  selectedIds,
  onSelect,
  onSelectAll,
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
          onDelete={onDelete}
        >
          <ProductCard
            data={product}
            action={
              <QuantityStepper
                quantity={2}
                onDecrease={() => {}}
                onIncrease={() => {}}
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
