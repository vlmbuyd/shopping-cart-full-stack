import styled from '@emotion/styled';
import CartHeader from '../components/Cart/CartHeader';
import CartItemList from '../components/Cart/CartItemList';
import OrderBill from '../components/Order/OrderBill';
import type { CartItemType } from '../types/product.types';
import { useState } from 'react';
import { saveSelectedIds } from '../utils/cartStorage';
import { calculateOrderBill } from '../domain/calculateOrderBill';
import { getOrderCountState } from '../domain/orderCount';

const mockProducts: CartItemType[] = [
  {
    id: 1,
    name: '상품이름A',
    price: 35000,
    imgUrl: 'https://picsum.photos/200/200',
    orderCount: 3,
  },
  {
    id: 2,
    name: '상품이름B',
    price: 25000,
    imgUrl: 'https://picsum.photos/200/200',
    orderCount: 2,
  },
];

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItemType[]>(mockProducts);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(() => {
    const saved = localStorage.getItem('selectedCartIds');
    if (saved) return new Set(JSON.parse(saved));

    return new Set(cartItems.map((item) => item.id));
  });

  const handleSelect = (id: number, isSelected: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (isSelected) next.add(id);
      else next.delete(id);

      saveSelectedIds([...next]);
      return next;
    });
  };

  const handleSelectAll = () => {
    setSelectedIds(() => {
      const next = new Set<number>();
      cartItems.forEach((item) => {
        if (selectedIds.size === 0) next.add(item.id);
        else next.delete(item.id);
      });

      saveSelectedIds([...next]);
      return next;
    });
  };

  const handleDecrease = (id: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id && getOrderCountState(item.orderCount).canDecrease
          ? { ...item, orderCount: item.orderCount - 1 }
          : item,
      ),
    );
  };

  const handleIncrease = (id: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id && getOrderCountState(item.orderCount).canIncrease
          ? { ...item, orderCount: item.orderCount + 1 }
          : item,
      ),
    );
  };

  const handleDelete = () => {};

  return (
    <Container>
      <CartHeader totalCount={selectedIds.size} />
      <CartItemList
        cartItems={cartItems}
        selectedIds={selectedIds}
        onSelect={handleSelect}
        onSelectAll={handleSelectAll}
        onDecrease={handleDecrease}
        onIncrease={handleIncrease}
        onDelete={handleDelete}
      />
      <OrderBill orderBill={calculateOrderBill(cartItems, selectedIds)} />
      <OrderConfirmButton>주문 확인</OrderConfirmButton>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100%;
`;

const OrderConfirmButton = styled.button`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  min-width: 430px;
  max-width: 1280px;
  width: 100%;
  height: 64px;
  background-color: #000;
  color: #fff;
`;
