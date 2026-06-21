import request from 'supertest';
import app from '../app.js';
import { products, orders } from '../db/inMemoryDb.js';

const addProduct = async (price: number, quantity = 99) => {
  const response = await request(app)
    .post('/products')
    .send({ name: '상품', price, imgUrl: 'https://x.com', quantity });

  return response.body.result.id as number;
};

describe('POST /orders API 테스트', () => {
  beforeEach(() => {
    products.length = 0;
    orders.length = 0;
  });

  test('선택한 상품으로 주문을 생성하면 201과 주문 id를 응답한다.', async () => {
    // given
    const productId = await addProduct(5000);

    // when
    const response = await request(app)
      .post('/orders')
      .send({ selectedProducts: [{ id: productId, orderCount: 2 }] });

    // then
    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: '성공적으로 생성되었습니다.',
      result: { id: expect.any(Number) },
    });
  });

  test('선택한 상품이 없으면 400과 EMPTY_SELECTED_PRODUCTS 코드를 응답한다.', async () => {
    // when
    const response = await request(app)
      .post('/orders')
      .send({ selectedProducts: [] });

    // then
    expect(response.status).toBe(400);
    expect(response.body.code).toBe('EMPTY_SELECTED_PRODUCTS');
  });

  test('존재하지 않는 상품으로 주문하면 404와 PRODUCT_NOT_EXIST 코드를 응답한다.', async () => {
    // when
    const response = await request(app)
      .post('/orders')
      .send({ selectedProducts: [{ id: 9999, orderCount: 1 }] });

    // then
    expect(response.status).toBe(404);
    expect(response.body.code).toBe('PRODUCT_NOT_EXIST');
  });
});

describe('GET /orders/:id API 테스트', () => {
  beforeEach(() => {
    products.length = 0;
    orders.length = 0;
  });

  const createOrder = async (
    selectedProducts: { id: number; orderCount: number }[],
  ) => {
    const response = await request(app)
      .post('/orders')
      .send({ selectedProducts });

    return response.body.result.id as number;
  };

  test('주문 정보와 결제 금액(배송비 3,000원)을 응답한다.', async () => {
    // given: 5,000원 × 2 = 10,000원 (10만원 미만 → 배송비 3,000원)
    const productId = await addProduct(5000);
    const orderId = await createOrder([{ id: productId, orderCount: 2 }]);

    // when
    const response = await request(app).get(`/orders/${orderId}`);

    // then
    expect(response.status).toBe(200);
    expect(response.body.result).toEqual({
      id: orderId,
      isRemoteArea: false,
      products: [
        {
          id: productId,
          name: '상품',
          price: 5000,
          imgUrl: 'https://x.com',
          orderCount: 2,
        },
      ],
      payment: {
        orderPrice: 10000,
        shippingFee: 3000,
        discountAmount: 0,
        totalPrice: 13000,
      },
    });
  });

  test('주문 금액이 100,000원 이상이면 배송비가 무료다.', async () => {
    // given: 50,000원 × 2 = 100,000원
    const productId = await addProduct(50000);
    const orderId = await createOrder([{ id: productId, orderCount: 2 }]);

    // when
    const response = await request(app).get(`/orders/${orderId}`);

    // then
    expect(response.body.result.payment).toEqual({
      orderPrice: 100000,
      shippingFee: 0,
      discountAmount: 0,
      totalPrice: 100000,
    });
  });

  test('존재하지 않는 주문 조회 시 404와 ORDER_NOT_EXIST 코드를 응답한다.', async () => {
    // when
    const response = await request(app).get('/orders/9999');

    // then
    expect(response.status).toBe(404);
    expect(response.body.code).toBe('ORDER_NOT_EXIST');
  });
});
