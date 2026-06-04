import type { ReactNode } from 'react';
import styled from '@emotion/styled';
import CheckBox from '../CheckBox/CheckBox';

interface Props {
  children: ReactNode;
  onSelect: (isSelected: boolean) => void;
  onDelete: () => void;
}

export default function CartItem({ children, onSelect, onDelete }: Props) {
  const handleSelected = (isSelected: boolean) => {
    onSelect(isSelected);
  };

  const handleDelete = () => {
    onDelete();
  };

  return (
    <Container>
      <Controls>
        <CheckBox onClick={handleSelected} />
        <DeleteButton type="button" onClick={handleDelete}>
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
