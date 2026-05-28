import express from 'express';
import ProductManager from './ProductManager.js';
import Cart from './Cart.js';
import AppService, { registerProduct } from './AppService.js';
import { errorHandler } from './errorHandler.js';

const app = express();

// productManager, cart 인스턴스를 테스트에서 사용하기 위해서 export한다.
export const productManager = new ProductManager();
export const cart = new Cart();
const appService = new AppService(productManager, cart);

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// 상품 추가
app.post('/products', (req, res) => {
  try {
    const { name, price, imgUrl, quantity } = req.body;

    // const id = productManager.addProduct({ name, price, imgUrl, quantity });
    const id = registerProduct({ name, price, imgUrl, quantity });

    res.status(201).json({
      code: 201,
      message: '성공적으로 생성되었습니다.',
      result: { id },
    });
  } catch (error) {
    const { status, code, message } = errorHandler(error);
    res.status(status).json({ code, message });
  }
});

// 상품 삭제
app.delete('/products/:id', (req, res) => {
  try {
    const productId = req.params.id;

    appService.deleteProductWithCascade(Number(productId));

    res.status(204).json();
  } catch (error) {
    const { status, code, message } = errorHandler(error);
    res.status(status).json({ code, message });
  }
});

// 상품 조회
app.get('/products', (_, res) => {
  try {
    const products = productManager.getProducts();

    res.status(200).json({
      code: 200,
      message: '요청에 성공했습니다.',
      result: { products },
    });
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
      code: 200,
      message: '요청에 성공했습니다.',
      result: { cartItems },
    });
  } catch (error) {
    const { status, code, message } = errorHandler(error);
    res.status(status).json({ code, message });
  }
});

// 장바구니 상품 삭제
app.delete('/carts/:id', (req, res) => {
  try {
    const productId = req.params.id;

    cart.deleteCartItem(Number(productId));

    res.status(204).json();
  } catch (error) {
    const { status, code, message } = errorHandler(error);
    res.status(status).json({ code, message });
  }
});

// 장바구니 상품 수량 변경
app.patch('/carts/:id', (req, res) => {
  try {
    const productId = Number(req.params.id);
    const { orderCount } = req.body;

    appService.updateCartOrderCount(productId, orderCount);

    res.status(200).json({
      code: 200,
      message: '성공적으로 수량이 변경되었습니다.',
      result: {
        id: productId,
        orderCount: orderCount,
      },
    });
  } catch (error) {
    const { status, code, message } = errorHandler(error);
    res.status(status).json({ code, message });
  }
});

export default app;
