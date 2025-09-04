'use client'

import { Product } from '@/types/product'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

export function ProductItem({ id, image, label, liked: like, price }: Product) {
  const [liked, setLiked] = useState(like)

  return (
    <div className="rounded-sm border border-gray-200 bg-white p-6">
      <div className="flex justify-end">
        <div
          onClick={() => setLiked(!liked)}
          className="flex size-12 cursor-pointer items-center justify-center rounded-sm border border-gray-200"
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
      </div>
      <Link href={`/product/${id}`}>
        <div className="flex aspect-square w-full items-center justify-center">
          {image && <Image src={image} alt={label} width={300} height={300} />}
        </div>
        <div className="mt-9 text-lg font-semibold">{label}</div>
        <div className="mt-3 text-2xl font-semibold text-blue-600">
          R$ {price.toFixed(2)}
        </div>
        <div className="mt-5 text-base text-gray-400">Em até 12X no cartão</div>
      </Link>
    </div>
  )
}
