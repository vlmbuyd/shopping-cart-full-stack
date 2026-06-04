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
  height: calc(100% - 64px);
  padding: 36px 24px 64px 24px;
  overflow: auto;
`;
