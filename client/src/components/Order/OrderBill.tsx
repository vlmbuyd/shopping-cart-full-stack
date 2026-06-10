import styled from '@emotion/styled';
import infoIcon from '../../assets/info.svg';
import { formatPrice } from '../../utils/formatPrice';

interface Props {
  orderBill: {
    orderPrice: number;
    shippingFee: number;
    totalPrice: number;
  };
}

export default function OrderBill({ orderBill }: Props) {
  return (
    <Container>
      <ShippingFeeInfo>
        <IconWrapper>
          <img src={infoIcon} alt="info-icon" />
        </IconWrapper>
        총 주문 금액이 100,000원 이상일 경우 무료 배송됩니다.
      </ShippingFeeInfo>

      <OrderDetails>
        <OrderPrice>
          <p>주문 금액</p>
          <strong>{formatPrice(orderBill.orderPrice)}원</strong>
        </OrderPrice>
        <ShippingFee>
          <p>배송비</p>
          <strong>{formatPrice(orderBill.shippingFee)}원</strong>
        </ShippingFee>
      </OrderDetails>

      <OrderDetails>
        <TotalPrice>
          <p>총 결제 금액</p>
          <strong>{formatPrice(orderBill.totalPrice)}원</strong>
        </TotalPrice>
      </OrderDetails>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ShippingFeeInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 500;
  color: #0a0d13;
`;

const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const OrderDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid #0000001a;
`;

const PriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 42px;
  font-size: 24px;
  font-weight: 700;
`;
const OrderPrice = styled(PriceRow)``;
const ShippingFee = styled(PriceRow)``;
const TotalPrice = styled(PriceRow)``;
