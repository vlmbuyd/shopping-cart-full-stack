import styled from '@emotion/styled';
import ProductCard from '../Product/ProductCard';

interface Props {}

export default function OrderItemList({}: Props) {
  return (
    <Container>
      {cartItems.map((cartItem) => (
        <ProductCard data={cartItem} quantity={<Quantity>2개</Quantity>} />
      ))}
    </Container>
  );
}

const Container = styled.div``;

const Quantity = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: #0a0d13;
`;
