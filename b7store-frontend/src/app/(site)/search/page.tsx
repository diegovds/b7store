import { ProductListFilter } from '@/components/categories/product-list-filter'
import { getCategorySearchQMetadata, getProducts } from '@/http/api'
import { ProductFilters } from '@/types/product-filters'
import { normalizeSearchParams } from '@/utils/search-params'
import { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'

type SearchPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const params = normalizeSearchParams(await searchParams)
  const q = params.q

  if (!q) {
    redirect('/')
  }

  return {
    title: `Busca por ${q}`,
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = normalizeSearchParams(await searchParams)
  const order = params.order
  const q = params.q

  const orderBy =
    order === 'views'
      ? 'views'
      : order === 'price'
        ? 'price'
        : order === 'selling'
          ? 'selling'
          : undefined

  const { metadata } = await getCategorySearchQMetadata(q || '')

  const { order: _order, page: _page, q: _q, ...filters } = params

  const productFilter: ProductFilters = {
    orderBy,
    limit: '6',
    metadata: JSON.stringify(filters),
    q,
  }

  const { error, products } = await getProducts(productFilter)

  if (error) {
    redirect('/')
  }

  return (
    <div>
      <div className="my-4 text-base text-gray-500">
        <Link href="/">Home</Link> &gt; Busca por {q}
      </div>
      <ProductListFilter
        products={products}
        metadata={metadata}
        productFilter={productFilter}
      />
    </div>
  )
}
