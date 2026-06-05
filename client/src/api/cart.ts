import type { CartItemType } from '../types/product.types';
import { http } from './api';

export type CartListResponse = CartItemType[];

export const getCartList = (): Promise<CartListResponse> => {
  return http.get<CartListResponse>('/products');
};
