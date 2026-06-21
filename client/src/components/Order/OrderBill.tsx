import styled from '@emotion/styled';
import infoIcon from '../../assets/info.svg';
import { formatPrice } from '../../utils/formatPrice';
import { getCartPayments } from '../../api/cart';
import { useQuery } from '../../api/useQuery';
import Skeleton from '../Skeleton/Skeleton';

export default function OrderBill() {
  const { data, isLoading, isSuccess } = useQuery({
    queryFn: getCartPayments,
  });

  if (isLoading) {
    return <OrderBillSkeleton />;
  }

  if (!isSuccess || !data) {
    return null;
  }

  const { orderPrice, shippingFee, totalPrice } = data.result;

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
          <strong>{formatPrice(orderPrice)}원</strong>
        </OrderPrice>
        <ShippingFee>
          <p>배송비</p>
          <strong>{formatPrice(shippingFee)}원</strong>
        </ShippingFee>
      </OrderDetails>

      <OrderDetails>
        <TotalPrice>
          <p>총 결제 금액</p>
          <strong>{formatPrice(totalPrice)}원</strong>
        </TotalPrice>
      </OrderDetails>
    </Container>
  );
}

function OrderBillSkeleton() {
  return (
    <Container>
      <ShippingFeeInfo>
        <Skeleton width="100%" height="18px" />
      </ShippingFeeInfo>

      <OrderDetails>
        <OrderPrice>
          <Skeleton width="80px" height="24px" />
          <Skeleton width="120px" height="24px" />
        </OrderPrice>
        <ShippingFee>
          <Skeleton width="80px" height="24px" />
          <Skeleton width="120px" height="24px" />
        </ShippingFee>
      </OrderDetails>

      <OrderDetails>
        <TotalPrice>
          <Skeleton width="100px" height="24px" />
          <Skeleton width="140px" height="24px" />
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
