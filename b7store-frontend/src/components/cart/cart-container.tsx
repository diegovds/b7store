'use client'

import { useCartStore } from '@/store/cart'
import { CartListItem } from '@/types/cart-list-item'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect } from 'react'
import { CartProductList } from './cart-product-list'
import { FinishPurchaseButton } from './FinishPurchaseButton'
import { ShippingBox } from './shipping-box'

type CartContainerProps = {
  initialCartProducts: CartListItem[]
  initialSubtotal: number
}

export const CartContainer = ({
  initialCartProducts,
  initialSubtotal,
}: CartContainerProps) => {
  const { cart, clearShipping, shippingCost } = useCartStore()

  useEffect(() => {
    clearShipping()
  }, [clearShipping])

  const total = initialSubtotal + shippingCost

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
            ( {cart.length} ite
            {cart.length !== 1 ? 'ns' : 'm'} )
          </span>
        </div>
      </div>

      <div className="mt-9 flex flex-col gap-8 md:flex-row">
        <div className="flex-1">
          <CartProductList initialList={initialCartProducts} />
        </div>
        <div className="flex flex-1 flex-col gap-4 md:max-w-sm">
          <div>
            <ShippingBox />
          </div>
          <div className="rounded-sm border border-gray-200 bg-white">
            <div className="border-b border-gray-200 p-6 md:px-8 md:py-6">
              <div className="mb-5 flex items-center justify-between">
                <div>Subtotal</div>
                <div className="font-medium">
                  R$ {initialSubtotal.toFixed(2)}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>Frete</div>
                <div className="font-medium">{shippingCost.toFixed(2)}</div>
              </div>
            </div>
            <div className="p-6 md:px-8 md:py-6">
              <div className="flex items-center justify-between">
                <div>Total</div>
                <div className="text-2xl font-medium text-blue-600">
                  R$ {total.toFixed(2)}
                </div>
              </div>
              <div className="my-3 text-right text-xs text-gray-500">
                Em até 12X no cartão
              </div>
              <FinishPurchaseButton />
              <div className="mt-6 flex justify-center">
                <Link href={'/'} className="text-xs font-medium text-gray-500">
                  Comprar outros produtos
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
