import AppError from '../errors/AppError.js';
import Product from '../model/Product.js';

const mockProductArgs = {
  id: 1,
  name: '아디다스양말',
  price: 5000,
  imgUrl: 'https://abc.com',
  quantity: 10,
} as const;

describe('Product 생성 기능 테스트', () => {
  test('유효한 정보로 생성하면 toJson()이 해당 정보를 반환한다.', () => {
    const product = new Product(
      mockProductArgs.id,
      mockProductArgs.name,
      mockProductArgs.price,
      mockProductArgs.quantity,
      mockProductArgs.imgUrl,
    );

    expect(product.toJson()).toEqual(mockProductArgs);
  });
});

describe('Product 상품명 검증 테스트', () => {
  test('상품명이 100자를 초과하면 에러를 발생시킨다.', () => {
    expect(() => {
      new Product(1, 'a'.repeat(101), 5000, 10);
    }).toThrow(new AppError('PRODUCT_NAME_LENGTH_EXCEEDED'));
  });

  test('상품명이 빈 문자열이면 에러를 발생시킨다.', () => {
    expect(() => {
      new Product(1, '', 5000, 10);
    }).toThrow(new AppError('EMPTY_PRODUCT_NAME'));
  });

  test('상품명이 null이면 에러를 발생시킨다.', () => {
    expect(() => {
      // @ts-ignore
      new Product(1, null, 5000, 10);
    }).toThrow(new AppError('EMPTY_PRODUCT_NAME'));
  });

  test('상품명이 undefined이면 에러를 발생시킨다.', () => {
    expect(() => {
      // @ts-ignore
      new Product(1, undefined, 5000, 10);
    }).toThrow(new AppError('EMPTY_PRODUCT_NAME'));
  });
});

describe('Product 가격 검증 테스트', () => {
  test('가격이 0 이하이면 에러를 발생시킨다.', () => {
    expect(() => {
      new Product(1, '아디다스양말', 0, 10);
    }).toThrow(new AppError('INVALID_PRODUCT_PRICE_TYPE'));
  });

  test('가격이 문자열이면 에러를 발생시킨다.', () => {
    expect(() => {
      // @ts-ignore
      new Product(1, '아디다스양말', '5000', 10);
    }).toThrow(new AppError('INVALID_PRODUCT_PRICE_TYPE'));
  });

  test('가격이 null이면 에러를 발생시킨다.', () => {
    expect(() => {
      // @ts-ignore
      new Product(1, '아디다스양말', null, 10);
    }).toThrow(new AppError('EMPTY_PRODUCT_PRICE'));
  });

  test('가격이 undefined이면 에러를 발생시킨다.', () => {
    expect(() => {
      // @ts-ignore
      new Product(1, '아디다스양말', undefined, 10);
    }).toThrow(new AppError('EMPTY_PRODUCT_PRICE'));
  });
});

describe('Product 재고 검증 테스트', () => {
  test('재고가 1 미만이면 에러를 발생시킨다.', () => {
    expect(() => {
      new Product(1, '아디다스양말', 5000, 0);
    }).toThrow(new AppError('INVALID_PRODUCT_QUANTITY_RANGE'));
  });

  test('재고가 99 초과이면 에러를 발생시킨다.', () => {
    expect(() => {
      new Product(1, '아디다스양말', 5000, 100);
    }).toThrow(new AppError('INVALID_PRODUCT_QUANTITY_RANGE'));
  });

  test('재고가 문자열이면 에러를 발생시킨다.', () => {
    expect(() => {
      // @ts-ignore
      new Product(1, '아디다스양말', 5000, '10');
    }).toThrow(new AppError('INVALID_PRODUCT_QUANTITY_RANGE'));
  });

  test('재고가 빈 문자열이면 에러를 발생시킨다.', () => {
    expect(() => {
      // @ts-ignore
      new Product(1, '아디다스양말', 5000, '');
    }).toThrow(new AppError('EMPTY_PRODUCT_QUANTITY'));
  });

  test('재고가 null이면 에러를 발생시킨다.', () => {
    expect(() => {
      // @ts-ignore
      new Product(1, '아디다스양말', 5000, null);
    }).toThrow(new AppError('EMPTY_PRODUCT_QUANTITY'));
  });

  test('재고가 undefined이면 에러를 발생시킨다.', () => {
    expect(() => {
      // @ts-ignore
      new Product(1, '아디다스양말', 5000, undefined);
    }).toThrow(new AppError('EMPTY_PRODUCT_QUANTITY'));
  });
});
