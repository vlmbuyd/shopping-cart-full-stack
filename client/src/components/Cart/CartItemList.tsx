import styled from '@emotion/styled';
import type { Product } from '../Product/product.types';
import CartItem from './CartItem';
import ProductCard from '../Product/ProductCard';
import QuantityStepper from './QuantityStepper';

const mockProducts: Product[] = [
  {
    id: 1,
    name: '상품이름A',
    price: 35000,
    imgUrl: 'https://picsum.photos/200/200',
    quantity: 3,
  },
  {
    id: 2,
    name: '상품이름B',
    price: 25000,
    imgUrl: 'https://picsum.photos/200/200',
    quantity: 2,
  },
];

export default function CartItemList() {
  const handleSelect = (isSelected: boolean) => {};

  const handleDelete = () => {};

  return (
    <Container>
      {mockProducts.map((product) => (
        <CartItem onSelect={handleSelect} onDelete={handleDelete}>
          <ProductCard
            data={product}
            action={
              <QuantityStepper
                quantity={2}
                onDecrease={() => {}}
                onIncrease={() => {}}
              />
            }
          />
        </CartItem>
      ))}
    </Container>
  );
}

const Container = styled.div``;
