interface ProductBase {
  id: number;
  name: string;
  price: number;
  imgUrl: string;
}

interface ProductType extends ProductBase {
  quantity: number;
}

interface CartItemType extends ProductBase {
  orderCount: number;
}

export type { ProductType, CartItemType };
