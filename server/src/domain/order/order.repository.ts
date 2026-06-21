import AppError from '../../errors/AppError.js';
import { orders } from '../../db/inMemoryDb.js';
import Order from '../../model/Order.js';

export interface OrderRepository {
  findById: (id: number) => Order;
  add: (order: Order) => void;
  update: (id: number, isRemoteArea: boolean) => Order;
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

  update(id: number, isRemoteArea: boolean) {
    const index = orders.findIndex((order) => order.toJson().id === id);
    if (index === -1) throw new AppError('ORDER_NOT_EXIST');

    const { orderItems } = orders[index].toJson();
    const updated = new Order(id, orderItems, isRemoteArea);
    orders[index] = updated;

    return updated;
  }

  nextId() {
    return ++this.id;
  }
}
