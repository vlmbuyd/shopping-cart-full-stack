import styled from '@emotion/styled';
import CartHeader from '../components/Cart/CartHeader';
import CartItemList from '../components/Cart/CartItemList';
import OrderBill from '../components/Order/OrderBill';
import type { CartItemType } from '../types/product.types';
import { useEffect, useState } from 'react';

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
    const set = new Set<number>();
    cartItems.forEach((item) => {
      set.add(item.id);
    });
    return set;
  });

  const handleSelect = (id: number, isSelected: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);

      if (isSelected) next.add(id);
      else next.delete(id);

      return next;
    });
  };

  const handleSelectAll = () => {
    setSelectedIds(() => {
      const set = new Set<number>();
      cartItems.forEach((item) => {
        if (selectedIds.size === 0) set.add(item.id);
        else set.delete(item.id);
      });
      return set;
    });
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
        onDelete={handleDelete}
      />
      <OrderBill />
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
