import type { CartItemType } from '../types/product.types';
import { http, type APIResponse } from './api';

type GetCartItemListResponse = {
  cartItems: CartItemType[];
};
export const getCartList = (): Promise<APIResponse<GetCartItemListResponse>> =>
  http.get<APIResponse<GetCartItemListResponse>>('/carts');

export const deleteCartItem = (id: number): Promise<void> =>
  http.delete<void>(`/carts/${id}`);

type UpdateCartItemResponse = Pick<CartItemType, 'orderCount'>;
export const updateCartItem = (
  id: number,
  orderCount: number,
): Promise<APIResponse<UpdateCartItemResponse>> =>
  http.patch<APIResponse<UpdateCartItemResponse>>(`/carts/${id}`, {
    orderCount,
  });
