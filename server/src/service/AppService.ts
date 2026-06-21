import CartService from '../domain/cart/cart.service.js';
import CouponService from '../domain/coupon/coupon.service.js';
import {
  DiscountContext,
  calculateCouponsDiscount,
  findBestCouponCombination,
  isCouponDisabled,
} from '../domain/coupon/coupon.calculator.js';
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
    private couponService: CouponService,
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

  private getOrderDetail(id: number) {
    const { orderItems, isRemoteArea, coupons } = this.orderService
      .getOrder(id)
      .toJson();

    const products = orderItems.map(({ id, orderCount }) => {
      const { name, price, imgUrl } = this.productService
        .getProductById(id)
        .toJson();

      return { id, name, price, imgUrl, orderCount };
    });

    const orderPrice = calculateOrderPrice(products);
    const shippingFee = calculateShippingFee(orderPrice, isRemoteArea);

    return { isRemoteArea, coupons, products, orderPrice, shippingFee };
  }

  private toDiscountContext(detail: {
    products: { price: number; orderCount: number }[];
    orderPrice: number;
    shippingFee: number;
  }): DiscountContext {
    return {
      orderItems: detail.products.map(({ price, orderCount }) => ({
        price,
        orderCount,
      })),
      orderPrice: detail.orderPrice,
      shippingFee: detail.shippingFee,
      now: new Date(),
    };
  }

  getOrder(id: number) {
    const detail = this.getOrderDetail(id);
    const { isRemoteArea, products, orderPrice, shippingFee } = detail;

    const appliedCoupons = this.couponService.getCouponsByIds(detail.coupons);
    const discountAmount = calculateCouponsDiscount(
      appliedCoupons,
      this.toDiscountContext(detail),
    );

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

  getOrderCoupons(id: number) {
    const detail = this.getOrderDetail(id);
    const context = this.toDiscountContext(detail);
    const coupons = this.couponService.getCoupons();

    // 적용 중인 쿠폰이 있으면 그것을, 없으면 최적 조합을 선택 상태로 표시한다.
    const selectedIds =
      detail.coupons.length > 0
        ? new Set(detail.coupons)
        : new Set(
            findBestCouponCombination(coupons, context).map(
              (coupon) => coupon.id,
            ),
          );

    return {
      coupons: coupons.map((coupon) => ({
        id: coupon.id,
        name: coupon.name,
        isSelected: selectedIds.has(coupon.id),
        isDisabled: isCouponDisabled(coupon, context),
        dueDate: coupon.dueDate,
        minOrderAmount: coupon.minOrderAmount,
        availableTime: coupon.availableTime,
      })),
    };
  }

  getCouponsDiscount(id: number, couponIds: number[]) {
    const context = this.toDiscountContext(this.getOrderDetail(id));
    const coupons = this.couponService.getCouponsByIds(
      Array.isArray(couponIds) ? couponIds : [],
    );

    return { discountAmount: calculateCouponsDiscount(coupons, context) };
  }

  updateOrderCoupons(id: number, couponIds: number[]) {
    const ids = Array.isArray(couponIds) ? couponIds : [];
    this.couponService.getCouponsByIds(ids);

    const order = this.orderService.updateCoupons(id, ids).toJson();

    return { id: order.id, coupons: order.coupons };
  }
}
