import { CartItem } from '@/types/cart-item'
import { cookies } from 'next/headers'

// auth cookie
export const getServerAuthToken = async (): Promise<string | null> => {
  const cookiesStore = await cookies()
  return cookiesStore.get('auth_token')?.value ?? null
}

export const setServerAuthToken = async (token: string) => {
  const cookiesStore = await cookies()
  cookiesStore.set('auth_token', token, { httpOnly: true })
}

export const clearServerAuthToken = async () => {
  const cookiesStore = await cookies()
  cookiesStore.delete('auth_token')
}

// cart cookie
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
