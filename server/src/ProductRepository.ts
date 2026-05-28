import AppError from './AppError.js';
import { products } from './db.js';
import Product from './Product.js';

export type ProductRepository = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  imgUrl?: string;
};

const ProductRepository = {
  id: 1,

  addProduct: function (product: Product) {
    const addedId = this.id;
    products.set(this.id++, product);

    return addedId;
  },

  deleteProduct: function (id: number) {
    if (!products.has(id)) {
      throw new AppError('PRODUCT_NOT_EXIST');
    }

    products.delete(id);
  },

  getProducts: function () {
    const result: Array<ProductRepository> = [];
    products.forEach((product, id) => {
      result.push({ id, ...product.getProduct() });
    });

    return result;
  },
};

// class ProductRepository {
//   // private products: Map<number, Product>;
//   private id = 1;

//   constructor() {
//     // this.products = new Map<number, Product>();
//     // this.id = 1;
//   }

//   // 생성된 상품의 id를 반환하여, 컨트롤러가 응답 본문에 담을 수 있도록 한다.
//   addProduct(product: Product): number {
//     this.validateProductQuantity(product.quantity);
//     this.validateProductName(product.name);
//     this.validateProductPrice(product.price);

//     const newId = this.id;
//     this.products.set(this.id++, product);
//     return newId;
//   }

//   deleteProduct(id: number) {
//     if (!this.products.has(id)) {
//       throw new AppError('PRODUCT_NOT_EXIST');
//     }

//     this.products.delete(id);
//   }

//   getProducts() {
//     let result: Array<Product & { id: number }> = [];

//     this.products.forEach((product, id) => {
//       result.push({ id, ...product });
//     });

//     return result;
//   }

//   reset() {
//     this.products.clear();
//     this.id = 1;
//   }
// }

export default ProductRepository;
