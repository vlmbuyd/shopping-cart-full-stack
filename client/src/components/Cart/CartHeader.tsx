import styled from '@emotion/styled';

export default function CartHeader({ totalCount }: { totalCount: number }) {
  return (
    <Container>
      <Header>
        <Title>장바구니</Title>
        {totalCount > 0 && (
          <Subtitle>현재 {totalCount}종류의 상품이 담겨있습니다.</Subtitle>
        )}
      </Header>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  height: 62px;
  margin-bottom: 36px;
`;

const Header = styled.div``;

const Title = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #000;
`;

const Subtitle = styled.p`
  font-size: 12px;
  font-weight: 500;
  color: #0a0d13;
`;
