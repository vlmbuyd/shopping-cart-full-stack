interface ProductBase {
  id: number;
  name: string;
  price: number;
  imgUrl: string;
}

interface Product extends ProductBase {
  quantity: number;
}

interface CartItem extends ProductBase {
  orderCount: number;
}

export type { Product, CartItem };
