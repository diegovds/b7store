import { ProductListFilter } from '@/components/categories/product-list-filter'
import { getProducts } from '@/http/api'
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
  const page = params.page
  const q = params.q

  const orderBy =
    order === 'views'
      ? 'views'
      : order === 'price'
        ? 'price'
        : order === 'selling'
          ? 'selling'
          : undefined

  const { order: _order, page: _page, q: _q, ...filters } = params

  const { error, products } = await getProducts({
    orderBy,
    limit: '8',
    metadata: JSON.stringify(filters),
    q,
  })

  if (error) {
    redirect('/')
  }

  const metadataMap = new Map<
    string,
    {
      id: string
      name: string
      values: { id: string; label: string }[]
    }
  >()

  for (const product of products) {
    for (const m of product.metadata) {
      const categoryId = m.metadataValue.categoryMetadata.id
      const existing = metadataMap.get(categoryId)

      if (existing) {
        if (!existing.values.some((v) => v.id === m.metadataValue.id)) {
          existing.values.push({
            id: m.metadataValue.id,
            label: m.metadataValue.label,
          })
        }
      } else {
        metadataMap.set(categoryId, {
          id: categoryId,
          name: m.metadataValue.categoryMetadata.name,
          values: [
            {
              id: m.metadataValue.id,
              label: m.metadataValue.label,
            },
          ],
        })
      }
    }
  }

  const metadata = Array.from(metadataMap.values())

  return (
    <div>
      <div className="my-4 text-base text-gray-500">
        <Link href="/">Home</Link> &gt; Busca por {q}
      </div>
      <ProductListFilter products={products} metadata={metadata} />
    </div>
  )
}
