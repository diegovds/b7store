'use server'

import { setServerCart } from '@/libs/server-cookies'
import { CartItem } from '@/types/cart-item'

export async function setCartState(cart: CartItem[]) {
  await setServerCart(cart)
}
