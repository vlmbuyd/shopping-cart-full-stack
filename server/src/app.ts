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

function createAppService(
  productRepo: ProductRepository,
  cartRepo: CartRepository,
) {
  const productService = new ProductService(productRepo);
  const cartService = new CartService(cartRepo);

  const appService = new AppService(productService, cartService);

  return appService;
}

const appService = createAppService(
  new InMemoryProductRepository(),
  new InMemoryCartRepository(),
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

// 장바구니 상품 추가
app.post('/carts', (req, res) => {
  try {
    const { id, orderCount } = req.body;

    const cartItemId = appService.addCartItem({ id, orderCount });

    res.status(201).json({
      message: '성공적으로 생성되었습니다.',
      result: { id: cartItemId },
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

// 장바구니 상품 수량 변경
app.patch('/carts/:cartItemId', (req, res) => {
  try {
    const cartItemId = Number(req.params.cartItemId);
    const { orderCount } = req.body;

    appService.updateCartItem({ id: cartItemId, orderCount });

    res.status(200).json({
      message: '성공적으로 수량이 변경되었습니다.',
      result: {
        id: cartItemId,
        orderCount: orderCount,
      },
    });
  } catch (error) {
    const { status, code, message } = errorHandler(error);
    res.status(status).json({ code, message });
  }
});

export default app;
