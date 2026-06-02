import AppError from '../../errors/AppError.js';
import Product, { ProductType } from '../../model/Product.js';
import { ProductRepository } from './product.repository.js';

class ProductService {
  constructor(private productRepository: ProductRepository) {}

  getProducts() {
    return this.productRepository.findAll();
  }

  getProductById(id: number) {
    return this.productRepository.findById(id);
  }

  addProduct({ name, price, quantity, imgUrl }: Omit<ProductType, 'id'>) {
    const id = this.productRepository.nextId();
    const newProduct = new Product(id, name, price, quantity, imgUrl);
    this.productRepository.add(newProduct);

    return id;
  }

  deleteProduct(id: number) {
    const exists = this.productRepository
      .findAll()
      .some((p: Product) => p.toJson().id === id);
    if (!exists) throw new AppError('PRODUCT_NOT_EXIST');

    this.productRepository.delete(id);
  }
}

export default ProductService;
