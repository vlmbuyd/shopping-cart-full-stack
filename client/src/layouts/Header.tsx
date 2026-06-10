import styled from '@emotion/styled';

export default function Header() {
  return (
    <Container>
      <Title>SHOP</Title>
    </Container>
  );
}

const Container = styled.header`
  display: flex;
  align-items: center;
  padding-left: 24px;
  width: 100%;
  min-height: 64px;
  background-color: #000000;
`;

const Title = styled.strong`
  font-size: 20px;
  font-weight: 800;
  color: #fff;
`;
