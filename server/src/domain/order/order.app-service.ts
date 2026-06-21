import CouponService from '../coupon/coupon.service.js';
import {
  DiscountContext,
  calculateCouponsDiscount,
  findBestCouponCombination,
  isCouponDisabled,
} from '../coupon/coupon.calculator.js';
import OrderService from './order.service.js';
import ProductService from '../product/product.service.js';
import {
  calculateOrderPrice,
  calculateShippingFee,
} from '../payment/payment.calculator.js';
import AppError from '../../errors/AppError.js';
import { OrderItemType } from '../../model/Order.js';

export default class OrderAppService {
  constructor(
    private productService: ProductService,
    private orderService: OrderService,
    private couponService: CouponService,
  ) {}

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
}
