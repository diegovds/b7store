import { CartItem } from '@/types/cart-item'
import { cookies } from 'next/headers'

export async function getServerCart(): Promise<CartItem[]> {
  const cookiesStore = await cookies()
  const value = cookiesStore.get('cart')?.value

  if (!value) return []

  try {
    return JSON.parse(value)
  } catch {
    return []
  }
}

export async function setServerCart(cart: CartItem[]) {
  const cookiesStore = await cookies()
  cookiesStore.set('cart', JSON.stringify(cart), { httpOnly: true })
}

export async function clearServerCart() {
  const cookiesStore = await cookies()
  cookiesStore.delete('cart')
}
