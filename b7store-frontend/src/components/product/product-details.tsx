'use client'

import { setCartState } from '@/actions/set-cart-state'
import { useCartStore } from '@/store/cart'
import { ProductComplete } from '@/types/product'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { useState } from 'react'

type ProductDetailsProps = {
  product: ProductComplete
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const [liked, setLiked] = useState(product.liked)
  const { addItem } = useCartStore()

  const addToCart = async () => {
    addItem({ productId: product.id, quantity: 1 })
    const updatedCart = useCartStore.getState().cart
    await setCartState(updatedCart)
    redirect('/cart')
  }

  return (
    <div className="flex-1 space-y-4">
      <div className="text-xs text-gray-500">Cód. {product.id}</div>
      <div className="text-2xl font-medium md:text-3xl">{product.label}</div>
      <div className="text-4xl font-medium text-blue-600">
        R$ {product.price.toFixed(2)}
      </div>
      <div className="text-sm text-gray-500">Em até 12X no cartão</div>
      <div className="flex gap-4">
        <button
          onClick={addToCart}
          className="flex-1 cursor-pointer rounded-sm border-0 bg-blue-600 py-4 text-white duration-300 hover:bg-blue-700 md:max-w-xs md:px-8"
        >
          Adicionar ao carrinho
        </button>
        <div
          onClick={() => setLiked(!liked)}
          className="flex size-14 cursor-pointer items-center justify-center rounded-sm border border-gray-200 bg-white"
        >
          <Image
            src={
              liked
                ? `/assets/ui/heart-3-fill.png`
                : `/assets/ui/heart-3-line.png`
            }
            alt=""
            width={24}
            height={24}
          />
        </div>
        <div className="flex size-14 cursor-pointer items-center justify-center rounded-sm border border-gray-200 bg-white">
          <Image
            src={`/assets/ui/share-line.png`}
            alt=""
            width={24}
            height={24}
          />
        </div>
      </div>
      <div className="mt-10 border-t border-gray-200 pt-10">
        <div className="mb-4 text-base text-gray-500">
          Calcular frete e prazo
        </div>
        <div className="flex flex-row gap-6">
          <input
            type="text"
            className="flex-1 rounded-sm border border-gray-200 px-4 py-3 text-base outline-none md:w-[359px] md:flex-none"
            placeholder="Digite aqui o CEP"
          />
          <button className="flex-1 cursor-pointer rounded-sm border-0 bg-blue-600 py-4 text-white duration-300 hover:bg-blue-700 md:flex-none md:px-8">
            Calcular
          </button>
        </div>
      </div>
    </div>
  )
}
