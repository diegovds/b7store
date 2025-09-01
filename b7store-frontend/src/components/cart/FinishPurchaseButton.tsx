'use client'

import { clearCartCookie } from '@/actions/clear-cart-cookie'
import { finishCart } from '@/actions/finish-cart'
import { useAuthStore } from '@/store/auth'
import { useCartStore } from '@/store/cart'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export const FinishPurchaseButton = () => {
  const { token, hydrated } = useAuthStore()
  const { cart, clearCart, selectedAdressId } = useCartStore()

  if (!hydrated) return null

  if (!token) {
    return (
      <Link
        href={'/login'}
        className="block w-full cursor-pointer rounded-sm border-0 bg-blue-600 px-6 py-5 text-center text-white"
      >
        Fazer login para finalizar
      </Link>
    )
  }

  const handleFinishButton = async () => {
    if (!token || !selectedAdressId) return null

    const sessionUrl = await finishCart(token, selectedAdressId, cart)

    if (sessionUrl) {
      await clearCartCookie()
      clearCart()
      redirect(sessionUrl)
    } else {
      alert('Ocorreu um erro')
    }
  }

  return (
    <button
      disabled={!selectedAdressId}
      onClick={handleFinishButton}
      className="w-full cursor-pointer rounded-sm border-0 bg-blue-600 px-6 py-5 text-white disabled:opacity-20"
    >
      Finalizar compra
    </button>
  )
}
