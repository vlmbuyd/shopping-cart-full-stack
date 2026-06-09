import type { CartItemType } from '../types/product.types';
import { http, type APIResponse } from './api';

type CartItemListResponse = {
  cartItems: CartItemType[];
};

export const getCartList = (): Promise<APIResponse<CartItemListResponse>> =>
  http.get<APIResponse<CartItemListResponse>>('/carts');

export const deleteCartItem = (id: number): Promise<void> =>
  http.delete<void>(`/carts/${id}`);
