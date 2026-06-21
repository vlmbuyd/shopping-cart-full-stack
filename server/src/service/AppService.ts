import CartService from '../domain/cart/cart.service.js';
import OrderService from '../domain/order/order.service.js';
import ProductService from '../domain/product/product.service.js';
import {
  calculateOrderPrice,
  calculateShippingFee,
} from '../domain/payment/payment.calculator.js';
import AppError from '../errors/AppError.js';
import { CartItemType } from '../model/CartItem.js';
import { OrderItemType } from '../model/Order.js';
import { ProductType } from '../model/Product.js';

export default class AppSerivce {
  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private orderService: OrderService,
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

  private getCartItemsWithProduct() {
    return this.cartService.getCartItems().map((item) => {
      const { id, orderCount, isSelected } = item.toJson();
      const { name, price, imgUrl } = this.productService
        .getProductById(id)
        .toJson();

      return { id, name, price, imgUrl, orderCount, isSelected };
    });
  }

  getCartItems() {
    return this.getCartItemsWithProduct();
  }

  getCartPayment() {
    const selectedItems = this.getCartItemsWithProduct().filter(
      (item) => item.isSelected,
    );

    const orderPrice = calculateOrderPrice(selectedItems);
    const shippingFee = calculateShippingFee(orderPrice);

    return { orderPrice, shippingFee, totalPrice: orderPrice + shippingFee };
  }

  addCartItem({ id, orderCount }: CartItemType) {
    return this.cartService.addCartItem({ id, orderCount });
  }

  updateCartItem({
    id,
    orderCount,
    isSelected,
  }: {
    id: number;
    orderCount?: number;
    isSelected?: boolean;
  }) {
    if (orderCount !== undefined) {
      const product = this.productService.getProductById(id);
      if (product.toJson().quantity < orderCount) {
        throw new AppError('PRODUCT_ORDER_COUNT_EXCEEDED');
      }
    }

    return this.cartService.updateCartItem({ id, orderCount, isSelected });
  }

  deleteCartItem(id: number) {
    this.cartService.deleteCartItem(id);
  }

  createOrder(selectedProducts: OrderItemType[]) {
    if (!Array.isArray(selectedProducts) || selectedProducts.length === 0) {
      throw new AppError('EMPTY_SELECTED_PRODUCTS');
    }

    selectedProducts.forEach(({ id }) => {
      if (!this.productService.hasProduct(id)) {
        throw new AppError('PRODUCT_NOT_EXIST_FOR_PURCHASE');
      }
    });

    return this.orderService.createOrder(selectedProducts);
  }

  updateOrder({ id, isRemoteArea }: { id: number; isRemoteArea: boolean }) {
    const order = this.orderService.updateRemoteArea(id, isRemoteArea).toJson();

    return { id: order.id, isRemoteArea: order.isRemoteArea };
  }

  getOrder(id: number) {
    const { orderItems, isRemoteArea } = this.orderService.getOrder(id).toJson();

    const products = orderItems.map(({ id, orderCount }) => {
      const { name, price, imgUrl } = this.productService
        .getProductById(id)
        .toJson();

      return { id, name, price, imgUrl, orderCount };
    });

    const orderPrice = calculateOrderPrice(products);
    const shippingFee = calculateShippingFee(orderPrice, isRemoteArea);
    const discountAmount = 0;

    return {
      id,
      isRemoteArea,
      products,
      payment: {
        orderPrice,
        shippingFee,
        discountAmount,
        totalPrice: orderPrice + shippingFee - discountAmount,
      },
    };
  }
}
