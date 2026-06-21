import AppError from '../../errors/AppError.js';
import { orders } from '../../db/inMemoryDb.js';
import Order from '../../model/Order.js';

export interface OrderRepository {
  findById: (id: number) => Order;
  add: (order: Order) => void;
  nextId: () => number;
}

export class InMemoryOrderRepository implements OrderRepository {
  private id = 0;

  findById(id: number) {
    const target = orders.find((order) => order.toJson().id === id);

    if (!target) throw new AppError('ORDER_NOT_EXIST');

    return target;
  }

  add(order: Order) {
    orders.push(order);
  }

  nextId() {
    return ++this.id;
  }
}
