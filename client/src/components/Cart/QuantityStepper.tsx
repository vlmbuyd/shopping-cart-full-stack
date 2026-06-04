import styled from '@emotion/styled';
import decreaseIcon from '../../assets/subtract.svg';
import increaseIcon from '../../assets/add.svg';

interface Props {
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
}

export default function QuantityStepper({
  quantity,
  onDecrease,
  onIncrease,
}: Props) {
  return (
    <Container>
      <DecreaseButton onClick={onDecrease}>
        <img src={decreaseIcon} alt="decrease-icon" />
      </DecreaseButton>

      <Quantity>{quantity}</Quantity>

      <IncreaseButton onClick={onIncrease}>
        <img src={increaseIcon} alt="increase-icon" />
      </IncreaseButton>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 80px;
  height: 24px;
`;

const Quantity = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 15px;
  font-size: 12px;
  font-weight: 500;
  color: #0a0d13;
`;

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  width: 24px;
  height: 24px;
  border: 1px solid #0000001a;
  border-radius: 8px;
  background-color: #fff;
`;

const DecreaseButton = styled(Button)``;
const IncreaseButton = styled(Button)``;
