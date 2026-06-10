import AppError from '../../errors/AppError.js';
import { products } from '../../db/inMemoryDb.js';
import Product from '../../model/Product.js';

export interface ProductRepository {
  findAll: () => Product[];
  findById: (id: number) => Product;
  add: (product: Product) => void;
  delete: (id: number) => void;
  nextId: () => number;
}

export class InMemoryProductRepository implements ProductRepository {
  private id = 0;

  findAll() {
    return [...products];
  }

  findById(id: number) {
    const target = products.find((product) => product.toJson().id === id);

    if (!target) throw new AppError('PRODUCT_NOT_EXIST');

    return target;
  }

  add(product: Product) {
    products.push(product);
  }

  delete(id: number) {
    const index = products.findIndex((p) => p.toJson().id === id);
    if (index !== -1) products.splice(index, 1);
  }

  nextId() {
    return ++this.id;
  }
}
