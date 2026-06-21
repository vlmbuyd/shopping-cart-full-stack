import styled from '@emotion/styled';
import OrderHeader from '../components/Order/OrderHeader';

export default function OrderConfirmPage() {
  return (
    <Container>
      <OrderHeader
        count={{
          type: 1,
          amount: 2,
        }}
      />
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;
