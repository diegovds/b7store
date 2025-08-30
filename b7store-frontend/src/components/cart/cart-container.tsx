'use client'

import { useCartStore } from '@/store/cart'
import { CartListItem } from '@/types/cart-list-item'
import Image from 'next/image'
import { useEffect } from 'react'

type CartContainerProps = {
  initialCartProducts: CartListItem[]
  initialSubtotal: number
}

export const CartContainer = ({
  initialCartProducts,
  initialSubtotal,
}: CartContainerProps) => {
  const cartStore = useCartStore((state) => state)

  useEffect(() => {
    cartStore.clearShipping()
  }, [cartStore])

  return (
    <div>
      <div className="flex items-center gap-2">
        <Image
          src={'/assets/ui/shopping-bag-4-line-black.png'}
          alt=""
          width={24}
          height={24}
        />
        <div className="text-base">
          Seu carrinho de compras{' '}
          <span className="text-gray-500">
            ( {cartStore.cart.length} ite
            {cartStore.cart.length !== 1 ? 'ns' : 'm'} )
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-8 md:flex-row">
        <div className="flex-1">Produtos</div>
        <div className="flex-1 md:max-w-sm">Info</div>
      </div>
    </div>
  )
}
