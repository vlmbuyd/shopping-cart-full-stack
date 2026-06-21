import type { Order } from '../types/order.types';
import type { CartItemType } from '../types/product.types';
import { http, type APIResponse } from './api';

type GetOrderItemListResponse = {
  cartItems: Order[];
};
export const getOrderList = (
  id: number,
): Promise<APIResponse<GetOrderItemListResponse>> =>
  http.get<APIResponse<GetOrderItemListResponse>>(`/carts/${id}`);

type SelectedProducts = Pick<CartItemType, 'id' | 'orderCount'>;
type CreateOrderBody = {
  selectedProducts: SelectedProducts[];
};
export const createOrder = (
  selectedProducts: SelectedProducts[],
): Promise<
  APIResponse<{
    id: number;
  }>
> =>
  http.post<
    APIResponse<{
      id: number;
    }>,
    CreateOrderBody
  >('/orders', {
    selectedProducts,
  });

