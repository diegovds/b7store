'use server'

import { getServerCart } from '@/libs/server-cookies'

export async function getCartState() {
  const cart = await getServerCart()

  return { cart }
}
