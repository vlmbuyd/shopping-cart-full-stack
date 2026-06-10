import styled from '@emotion/styled';
import Skeleton from '../Skeleton/Skeleton';

const SKELETON_ITEM_COUNT = 3;

export default function CartItemListSkeleton() {
  return (
    <Container>
      <SelectAll>
        <Skeleton width="20px" height="20px" />
        <Skeleton width="48px" height="12px" />
      </SelectAll>

      {Array.from({ length: SKELETON_ITEM_COUNT }).map((_, index) => (
        <Item key={index}>
          <Controls>
            <Skeleton width="20px" height="20px" />
            <Skeleton width="40px" height="24px" />
          </Controls>

          <Card>
            <Skeleton width="112px" height="112px" borderRadius="8px" />
            <Body>
              <Content>
                <Skeleton width="120px" height="12px" />
                <Skeleton width="80px" height="24px" />
              </Content>
              <Skeleton width="100px" height="32px" />
            </Body>
          </Card>
        </Item>
      ))}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 52px;
`;

const SelectAll = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Item = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 12px;
  border-top: 1px solid #0000001a;
`;

const Controls = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const Card = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  width: 100%;
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  height: 100%;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;
