import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import CartHeader from '../components/Cart/CartHeader';
import CartItemList from '../components/Cart/CartItemList';
import OrderBill from '../components/Order/OrderBill';
import type { CartItemType } from '../types/product.types';
import { saveSelectedIds } from '../utils/cartStorage';
import { calculateOrderBill } from '../domain/calculateOrderBill';
import {
  getOrderCountState,
  MAX_ORDER_COUNT,
  MIN_ORDER_COUNT,
} from '../domain/orderCount';
import { deleteCartItem, getCartList, updateCartItem } from '../api/cart';
import { useQuery } from '../api/useQuery';

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(() => {
    const saved = localStorage.getItem('selectedCartIds');
    if (saved) return new Set(JSON.parse(saved));

    return new Set(cartItems.map((item) => item.id));
  });

  const { data, isSuccess, refetch } = useQuery({
    queryFn: getCartList,
  });

  useEffect(() => {
    if (data && isSuccess) {
      setCartItems(data.result.cartItems);
    }
  }, [data]);

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

      if (selectedIds.size !== cartItems.length) {
        cartItems.forEach((item) => {
          next.add(item.id);
        });
      }

      saveSelectedIds([...next]);
      return next;
    });
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteCartItem(id);
      refetch();
    } catch (err) {
      if (err instanceof Error) {
        alert(err.message);
      }
    }
  };

  const handleUpdate = async (
    id: number,
    orderCount: number,
    delta: 1 | -1,
  ) => {
    const updatedOrderCount = orderCount + delta;
    if (
      updatedOrderCount < MIN_ORDER_COUNT ||
      updatedOrderCount > MAX_ORDER_COUNT
    ) {
      return;
    }

    try {
      await updateCartItem(id, updatedOrderCount);
      refetch();
    } catch (err) {
      if (err instanceof Error) {
        alert(err.message);
      }
    }
  };

  return (
    <Container>
      <CartHeader totalCount={selectedIds.size} />
      {isSuccess && cartItems.length > 0 && (
        <>
          <CartItemList
            cartItems={cartItems}
            selectedIds={selectedIds}
            onSelect={handleSelect}
            onSelectAll={handleSelectAll}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
          <OrderBill orderBill={calculateOrderBill(cartItems, selectedIds)} />
        </>
      )}

      {isSuccess && cartItems.length === 0 && (
        <EmptyItem>장바구니에 담은 상품이 없습니다.</EmptyItem>
      )}

      <OrderConfirmButton disabled={cartItems && cartItems.length === 0}>
        주문 확인
      </OrderConfirmButton>
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const EmptyItem = styled.p`
  position: absolute;
  top: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  font-size: 16px;
  font-weight: 400;
  color: #0a0d13;
  text-align: center;
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

  &:disabled {
    background-color: #bebebe;
    cursor: not-allowed;
  }
`;
