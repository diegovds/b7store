'use client'

import { useAuthStore } from '@/store/auth'
import { useCartStore } from '@/store/cart'
import { CartItem } from '@/types/cart-item'
import { useEffect } from 'react'

type Props = {
  token: string | null
  cart: CartItem[]
}

export const StoreHydration = ({ token, cart }: Props) => {
  const { setHydrated, setToken } = useAuthStore()

  useEffect(() => {
    if (token) setToken(token)
    setHydrated(true)

    if (cart.length > 0) {
      useCartStore.setState({ cart })
    }
  }, [token, cart, setHydrated, setToken])

  return null
}
