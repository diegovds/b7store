'use client'

import { ProductComplete } from '@/types/product'
import Image from 'next/image'
import { useState } from 'react'

type ProductDetailsProps = {
  product: ProductComplete
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const [liked, setLiked] = useState(product.liked)

  const addToCart = async () => {
    // TODO: Criação do carrinho de compras
  }

  return (
    <div className="flex-1">
      <div className="mb-2 text-xs text-gray-500">Cód. {product.id}</div>
      <div className="mb-6 text-3xl font-medium">{product.label}</div>
      <div className="mb-2 text-4xl font-medium text-blue-600">
        R$ {product.price.toFixed(2)}
      </div>
      <div className="mb-6 text-sm text-gray-500">Em até 12X no cartão</div>
      <div className="flex gap-4">
        <button
          onClick={addToCart}
          className="max-w-xs flex-1 cursor-pointer rounded-sm border-0 bg-blue-600 px-8 py-4 text-white duration-300 hover:bg-blue-700"
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
    </div>
  )
}
