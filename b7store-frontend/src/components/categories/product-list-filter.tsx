'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useQueryString } from '@/hooks/use-querystring'
import { GetCategorySlugMetadata200MetadataItem, getProducts } from '@/http/api'
import { Product } from '@/types/product'
import { ProductFilters } from '@/types/product-filters'
import { zodResolver } from '@hookform/resolvers/zod'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import * as z from 'zod'
import { ProductItem } from '../product-item'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion'
import { FilterItem } from './filter-item'

type ProductListFilterProps = {
  products: Product[]
  metadata: GetCategorySlugMetadata200MetadataItem[]
  productFilter: ProductFilters
}

const filterSchema = z.object({
  order: z.enum(['views', 'price', 'selling']),
})

type FilterFormValues = z.infer<typeof filterSchema>

export function ProductListFilter({
  products,
  metadata,
  productFilter,
}: ProductListFilterProps) {
  const queryString = useQueryString()
  const [filterOpened, setFilterOpened] = useState(false)
  const mobileRef = useRef<HTMLDivElement>(null)

  // animação suave da altura no mobile
  useEffect(() => {
    const el = mobileRef.current
    if (!el) return

    if (filterOpened) {
      el.style.height = el.scrollHeight + 'px'
      const timer = setTimeout(() => {
        el.style.height = 'auto'
      }, 300) // igual ao duration-300
      return () => clearTimeout(timer)
    } else {
      el.style.height = el.scrollHeight + 'px'
      requestAnimationFrame(() => {
        el.style.height = '0px'
      })
    }
  }, [filterOpened])

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

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ['get-products', productFilter],
      queryFn: async ({ pageParam = '1' }) => {
        const response = await getProducts({
          page: pageParam,
          ...productFilter,
        })
        return response.products ?? []
      },
      getNextPageParam: (lastPage, pages) =>
        lastPage.length === 0 ? undefined : (pages.length + 1).toString(),
      initialPageParam: '1',
      initialData: { pages: [products], pageParams: ['1'] },
    })

  const allProducts = data?.pages.flat() ?? products

  return (
    <div>
      {/* header com quantidade + selects */}
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div className="text-3xl">
          <strong>{allProducts.length}</strong> Produto
          {allProducts.length !== 1 ? 's' : ''}
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

          {/* botão mobile */}
          <div
            onClick={() => setFilterOpened(!filterOpened)}
            className="flex flex-1 cursor-pointer items-center rounded-sm border border-gray-200 bg-white px-6 text-sm text-gray-500 md:hidden"
          >
            Filtrar por
          </div>
        </div>
      </div>

      {/* conteúdo: filtros + lista */}
      <div className="mt-8 flex flex-col gap-8 md:flex-row">
        {/* Mobile */}
        <div
          ref={mobileRef}
          className="h-0 overflow-hidden transition-all duration-300 ease-in-out md:hidden"
        >
          <Accordion type="multiple" defaultValue={metadata.map((d) => d.id)}>
            {metadata.map((data) => (
              <AccordionItem key={data.id} value={data.id}>
                <AccordionTrigger className="flex flex-1 items-center text-lg font-medium hover:no-underline">
                  {data.name}
                </AccordionTrigger>
                <AccordionContent>
                  {data.values.map((value) => (
                    <FilterItem
                      key={value.id}
                      item={{ id: value.id, label: value.label }}
                      groupId={data.id}
                      selected={() => setFilterOpened(!filterOpened)}
                    />
                  ))}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Desktop */}
        <div className="hidden flex-1 md:block md:max-w-70">
          <Accordion type="multiple" defaultValue={metadata.map((d) => d.id)}>
            {metadata.map((data) => (
              <AccordionItem key={data.id} value={data.id}>
                <AccordionTrigger className="flex flex-1 items-center text-xl font-medium hover:no-underline">
                  {data.name}
                </AccordionTrigger>
                <AccordionContent>
                  {data.values.map((value) => (
                    <FilterItem
                      key={value.id}
                      item={{ id: value.id, label: value.label }}
                      groupId={data.id}
                      selected={() => setFilterOpened(!filterOpened)}
                    />
                  ))}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Lista de produtos */}
        <div className="grid flex-1 grid-cols-1 gap-8 md:grid-cols-3">
          {allProducts.map((product) => (
            <ProductItem key={product.id} {...product} />
          ))}
        </div>
      </div>

      {/* Paginação infinita */}
      {hasNextPage && (
        <div className="flex justify-center">
          <button
            onClick={() => fetchNextPage()}
            className="mt-12 w-full cursor-pointer rounded-sm border-0 bg-blue-600 py-4 text-white duration-300 hover:bg-blue-700 md:max-w-xs md:px-8"
          >
            {isFetchingNextPage ? 'Carregando...' : 'Carregar mais'}
          </button>
        </div>
      )}
    </div>
  )
}
