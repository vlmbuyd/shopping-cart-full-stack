// import AppError from './AppError.js';
// import Cart from './Cart.js';
// import ProductManager from './ProductManager.js';

import Product from './Product.js';
import ProductRepository from './ProductRepository.js';

// class AppService {
//   constructor(
//     private productManager: ProductManager,
//     private cart: Cart,
//   ) {
//     this.productManager = productManager;
//     this.cart = cart;
//   }

//   updateCartOrderCount(id: number, orderCount: number) {
//     const products = this.productManager.getProducts();
//     const targetProduct = products.find((product) => product.id === id);

//     if (!targetProduct) {
//       // TODO: 에러 엔드포인트 및 메시지 정의 필요
//       throw new Error('찾으시는 상품이 존재하지 않습니다.');
//     }

//     if (targetProduct.quantity < orderCount) {
//       throw new AppError('PRODUCT_ORDER_COUNT_EXCEEDED');
//     }

//     this.cart.setOrderCount(id, orderCount);
//   }

//   deleteProductWithCascade(id: number) {
//     this.productManager.deleteProduct(id);

//     if (!this.cart.hasCartItem(id)) return;
//     this.cart.deleteCartItem(id);
//   }

//   getCartItems() {
//     const cartItems = this.cart.getCartItem();
//     const products = this.productManager.getProducts();
//     return cartItems.map(({ id, orderCount }) => {
//       const findProduct = products.find((product) => product.id === id);
//       if (!findProduct) {
//         // TODO: 리팩토링 해야됨
//         throw new Error('요청하신 장바구니 상품을 조회할 수 없습니다.');
//       }

//       return {
//         id,
//         name: findProduct.name,
//         price: findProduct.price,
//         imgUrl: findProduct.imgUrl,
//         orderCount,
//       };
//     });
//   }
// }

// export default AppService;

export function registerProduct({
  name,
  price,
  imgUrl,
  quantity,
}: {
  name: string;
  price: number;
  imgUrl: string;
  quantity: number;
}) {
  const product = new Product(name, price, quantity, imgUrl);
  ProductRepository.addProduct(product);
}
