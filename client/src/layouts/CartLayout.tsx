import styled from '@emotion/styled';
import { Outlet } from 'react-router-dom';

export default function CartLayout() {
  return (
    <Container>
      <Outlet />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 36px 24px 0 24px;
`;
