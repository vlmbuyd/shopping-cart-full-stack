import styled from '@emotion/styled';
import CartHeader from '../components/Cart/CartHeader';
import CartItemList from '../components/Cart/CartItemList';
import OrderBill from '../components/Order/OrderBill';

export default function CartPage() {
  return (
    <Container>
      <CartHeader totalCount={2} />
      <CartItemList />
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
