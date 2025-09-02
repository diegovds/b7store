'use server'

import { postCartFinish } from '@/http/api'
import { CartItem } from '@/types/cart-item'

export const finishCart = async (
  token: string,
  addressId: number,
  cart: CartItem[],
) => {
  try {
    const response = await postCartFinish(
      { cart, addressId },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )

    if (response.url) return response.url

    return null
  } catch {
    return null
  }
}
