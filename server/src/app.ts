import express from 'express';
import cors from 'cors';
import AppService from './service/AppService.js';
import { errorHandler } from './errors/errorHandler.js';
import ProductService from './domain/product/product.service.js';
import {
  InMemoryProductRepository,
  ProductRepository,
} from './domain/product/product.repository.js';
import CartService from './domain/cart/cart.service.js';
import {
  CartRepository,
  InMemoryCartRepository,
} from './domain/cart/cart.repository.js';
import OrderService from './domain/order/order.service.js';
import {
  InMemoryOrderRepository,
  OrderRepository,
} from './domain/order/order.repository.js';

function createAppService(
  productRepo: ProductRepository,
  cartRepo: CartRepository,
  orderRepo: OrderRepository,
) {
  const productService = new ProductService(productRepo);
  const cartService = new CartService(cartRepo);
  const orderService = new OrderService(orderRepo);

  const appService = new AppService(productService, cartService, orderService);

  return appService;
}

const appService = createAppService(
  new InMemoryProductRepository(),
  new InMemoryCartRepository(),
  new InMemoryOrderRepository(),
);

const app = express();
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
  }),
);
app.use(express.json());

// 상품 조회
app.get('/products', (_, res) => {
  try {
    const products = appService.getProducts();

    res.status(200).json({
      message: '요청에 성공했습니다.',
      result: { products },
    });
  } catch (error) {
    const { status, code, message } = errorHandler(error);
    res.status(status).json({ code, message });
  }
});

// 상품 추가
app.post('/products', (req, res) => {
  try {
    const { name, price, imgUrl, quantity } = req.body;

    const id = appService.addProduct({ name, price, imgUrl, quantity });

    res.status(201).json({
      message: '성공적으로 생성되었습니다.',
      result: { id },
    });
  } catch (error) {
    const { status, code, message } = errorHandler(error);
    res.status(status).json({ code, message });
  }
});

// 상품 삭제
app.delete('/products/:productId', (req, res) => {
  try {
    const productId = req.params.productId;

    appService.deleteProduct(Number(productId));

    res.status(204).json();
  } catch (error) {
    const { status, code, message } = errorHandler(error);
    res.status(status).json({ code, message });
  }
});

// 장바구니 상품 조회
app.get('/carts', (_, res) => {
  try {
    const cartItems = appService.getCartItems();

    res.status(200).json({
      message: '요청에 성공했습니다.',
      result: { cartItems },
    });
  } catch (error) {
    const { status, code, message } = errorHandler(error);
    res.status(status).json({ code, message });
  }
});

app.get('/carts/payment', (_, res) => {
  try {
    const payment = appService.getCartPayment();

    res.status(200).json({
      message: '요청에 성공했습니다.',
      result: payment,
    });
  } catch (error) {
    const { status, code, message } = errorHandler(error);
    res.status(status).json({ code, message });
  }
});

// 장바구니 상품 추가
app.post('/carts/:cartItemId', (req, res) => {
  try {
    const { orderCount } = req.body;
    const cartItemId = req.params.cartItemId;

    const id = appService.addCartItem({ id: Number(cartItemId), orderCount });

    res.status(201).json({
      message: '성공적으로 생성되었습니다.',
      result: { id },
    });
  } catch (error) {
    const { status, code, message } = errorHandler(error);
    res.status(status).json({ code, message });
  }
});

// 장바구니 상품 삭제
app.delete('/carts/:cartItemId', (req, res) => {
  try {
    const cartItemId = req.params.cartItemId;

    appService.deleteCartItem(Number(cartItemId));

    res.status(204).json();
  } catch (error) {
    const { status, code, message } = errorHandler(error);
    res.status(status).json({ code, message });
  }
});

// 장바구니 상품 선택 및 수량 변경
app.patch('/carts/:cartItemId', (req, res) => {
  try {
    const cartItemId = Number(req.params.cartItemId);
    const { orderCount, isSelected } = req.body;

    const updated = appService.updateCartItem({
      id: cartItemId,
      orderCount,
      isSelected,
    });

    res.status(200).json({
      message: '성공적으로 변경되었습니다.',
      result: updated,
    });
  } catch (error) {
    const { status, code, message } = errorHandler(error);
    res.status(status).json({ code, message });
  }
});

// 주문 생성
app.post('/orders', (req, res) => {
  try {
    const { selectedProducts } = req.body;

    const id = appService.createOrder(selectedProducts);

    res.status(201).json({
      message: '성공적으로 생성되었습니다.',
      result: { id },
    });
  } catch (error) {
    const { status, code, message } = errorHandler(error);
    res.status(status).json({ code, message });
  }
});

// 주문 정보 조회
app.get('/orders/:orderId', (req, res) => {
  try {
    const orderId = Number(req.params.orderId);

    const order = appService.getOrder(orderId);

    res.status(200).json({
      message: '요청에 성공했습니다.',
      result: order,
    });
  } catch (error) {
    const { status, code, message } = errorHandler(error);
    res.status(status).json({ code, message });
  }
});

// 주문 정보 업데이트 (도서 산간 지역 여부)
app.patch('/orders/:orderId', (req, res) => {
  try {
    const orderId = Number(req.params.orderId);
    const { isRemoteArea } = req.body;

    const updated = appService.updateOrder({ id: orderId, isRemoteArea });

    res.status(200).json({
      message: '성공적으로 변경되었습니다.',
      result: updated,
    });
  } catch (error) {
    const { status, code, message } = errorHandler(error);
    res.status(status).json({ code, message });
  }
});

export default app;
