import styled from '@emotion/styled';
import CartHeader from '../components/Cart/CartHeader';
import CartItemList from '../components/Cart/CartItemList';

export default function CartPage() {
  return (
    <Container>
      <CartHeader totalCount={2} />

      <CartItemList />
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100%;
`;
