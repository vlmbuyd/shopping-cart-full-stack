import type { ReactNode } from 'react';
import styled from '@emotion/styled';
import CheckBox from '../CheckBox/CheckBox';

interface Props {
  isSelected: boolean;
  onSelect: (isSelected: boolean) => void;
  onDelete: () => void;
  children: ReactNode;
}

export default function CartItem({
  isSelected,
  onSelect,
  onDelete,
  children,
}: Props) {
  return (
    <Container>
      <Controls>
        <CheckBox isSelected={isSelected} onSelect={onSelect} />
        <DeleteButton type="button" onClick={onDelete}>
          삭제
        </DeleteButton>
      </Controls>

      {children}
    </Container>
  );
}

const Container = styled.div`
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

const DeleteButton = styled.button`
  width: 40px;
  height: 24px;
  border: 1px solid #0000001a;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  color: #0a0d13;
`;
