'use client'

import { useQueryString } from '@/hooks/use-querystring'
import { GetCategorySlugMetadata200MetadataItem } from '@/http/api'
import { Product } from '@/types/product'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import * as z from 'zod'
import { ProductItem } from '../product-item'
import { FilterGroup } from './filter-group'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type ProductListFilterProps = {
  products: Product[]
  metadata: GetCategorySlugMetadata200MetadataItem[]
}

// Zod schema
const filterSchema = z.object({
  order: z.enum(['views', 'price', 'selling']),
})

type FilterFormValues = z.infer<typeof filterSchema>

export function ProductListFilter({
  products,
  metadata,
}: ProductListFilterProps) {
  const queryString = useQueryString()
  const [filterOpened, setFilterOpened] = useState(false)

  const defaultValues: FilterFormValues = {
    order: (queryString.get('order') as FilterFormValues['order']) || 'views',
  }

  const { control } = useForm<FilterFormValues>({
    resolver: zodResolver(filterSchema),
    defaultValues,
  })

  const handleOrderChange = (value: FilterFormValues['order']) => {
    queryString.set('order', value)
  }

  return (
    <div>
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div className="text-3xl">
          <strong>{products.length}</strong> Produto
          {products.length !== 1 ? 's' : ''}
        </div>

        <div className="flex w-full flex-row gap-5 md:max-w-70">
          <Controller
            name="order"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={(val) => {
                  field.onChange(val)
                  handleOrderChange(val as FilterFormValues['order'])
                }}
              >
                <SelectTrigger className="flex h-14 flex-1 items-center rounded-sm border border-gray-200 bg-white px-6 text-gray-500 outline-none">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="views">Popularidade</SelectItem>
                  <SelectItem value="price">Por preço</SelectItem>
                  <SelectItem value="selling">Mais vendidos</SelectItem>
                </SelectContent>
              </Select>
            )}
          />

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
          className={`flex-1 overflow-x-hidden overflow-y-hidden duration-300 md:max-w-70 ${filterOpened ? `max-h-screen` : `max-h-0`} md:max-h-fit`}
        >
          {metadata.map((data) => (
            <FilterGroup
              key={data.id}
              groupId={data.id}
              groupName={data.name}
              filters={data.values}
            />
          ))}
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
