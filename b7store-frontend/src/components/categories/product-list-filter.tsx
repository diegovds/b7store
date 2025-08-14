'use client'

import { useQueryString } from '@/hooks/use-querystring'
import { Product } from '@/types/product'
import { ChangeEvent, useState } from 'react'
import { ProductItem } from '../product-item'

type ProductListFilterProps = {
  products: Product[]
}

export function ProductListFilter({ products }: ProductListFilterProps) {
  const queryString = useQueryString()
  const [filterOpened, setFilterOpened] = useState(false)

  const order = queryString.get('order') ?? 'views'

  const handleSelectChanged = (e: ChangeEvent<HTMLSelectElement>) => {
    queryString.set('order', e.target.value)
  }

  return (
    <div>
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div className="text-3xl">
          <strong>{products.length}</strong> Produtos
        </div>
        <div className="flex w-full flex-row gap-5 md:max-w-70">
          <select
            defaultValue={order}
            onChange={handleSelectChanged}
            className="flex h-14 flex-1 items-center rounded-sm border border-gray-200 bg-white px-6 text-gray-500 outline-none"
          >
            <option value="views">Popularidade</option>
            <option value="price">Por preço</option>
            <option value="selling">Mais vendidos</option>
          </select>
          <div
            onClick={() => setFilterOpened(!filterOpened)}
            className="flex h-14 flex-1 cursor-pointer items-center rounded-sm border border-gray-200 bg-white px-6 text-gray-500 md:hidden"
          >
            Filtrar por
          </div>
        </div>
      </div>
      <div className="mt-8 flex flex-col gap-8 md:flex-row">
        <div
          className={`flex-1 md:max-w-70 ${filterOpened ? `block` : `hidden`} md:block`}
        >
          Filtros
        </div>
        <div className="grid flex-1 grid-cols-1 gap-8 md:grid-cols-3">
          {products.map((product) => (
            <ProductItem key={product.id} {...product} />
          ))}
        </div>
      </div>
    </div>
  )
}
