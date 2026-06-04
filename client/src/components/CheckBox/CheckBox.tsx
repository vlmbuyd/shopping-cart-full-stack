import { useState } from 'react';
import styled from '@emotion/styled';
import checkIcon from '../../assets/check.svg';
import unCheckIcon from '../../assets/uncheck.svg';

export default function CheckBox({
  onClick,
}: {
  onClick: (isSelected: boolean) => void;
}) {
  const [isSelected, setIsSelected] = useState(true);

  const handleClick = () => {
    const next = !isSelected;
    setIsSelected(next);
    onClick(next);
  };

  return (
    <Container $isSelected={isSelected} onClick={handleClick}>
      <IconWrapper $isSelected={isSelected}>
        {isSelected ? (
          <img src={checkIcon} alt="checkIcon" />
        ) : (
          <img src={unCheckIcon} alt="unCheckIcon" />
        )}
      </IconWrapper>
    </Container>
  );
}

const Container = styled.button<{ $isSelected: boolean }>`
  width: 24px;
  height: 24px;
  border: 1px solid ${({ $isSelected }) => ($isSelected ? 'none' : '#0000001A')};
  border-radius: 8px;
  background-color: ${({ $isSelected }) => ($isSelected ? '#000' : '#fff')};
`;

const IconWrapper = styled.div<{ $isSelected: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;
