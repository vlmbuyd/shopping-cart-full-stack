import CartService from '../domain/cart/cart.service.js';
import ProductService from '../domain/product/product.service.js';
import AppError from '../errors/AppError.js';
import { CartItemType } from '../model/CartItem.js';
import { ProductType } from '../model/Product.js';

export default class AppSerivce {
  constructor(
    private productService: ProductService,
    private cartService: CartService,
  ) {}

  getProducts() {
    return this.productService.getProducts();
  }

  addProduct({ name, price, quantity, imgUrl }: Omit<ProductType, 'id'>) {
    return this.productService.addProduct({ name, price, quantity, imgUrl });
  }

  deleteProduct(id: number) {
    this.productService.deleteProduct(id);
    this.cartService.deleteCartItemIfExist(id);
  }

  getCartItems() {
    const cartItems = this.cartService.getCartItems();

    return cartItems.map((item) => {
      const itemId = item.toJson().id;
      const product = this.productService.getProductById(itemId);
      const { name, price, imgUrl } = product.toJson();

      return {
        id: itemId,
        name,
        price,
        imgUrl,
        orderCount: item.toJson().orderCount,
      };
    });
  }

  addCartItem({ id, orderCount }: CartItemType) {
    return this.cartService.addCartItem({ id, orderCount });
  }

  updateCartItem({ id, orderCount }: CartItemType) {
    const product = this.productService.getProductById(id);
    if (product.toJson().quantity < orderCount) {
      throw new AppError('PRODUCT_ORDER_COUNT_EXCEEDED');
    }

    this.cartService.updateCartItem({ id, orderCount });
  }

  deleteCartItem(id: number) {
    this.cartService.deleteCartItem(id);
  }
}
