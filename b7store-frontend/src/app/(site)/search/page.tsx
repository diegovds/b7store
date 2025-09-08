import { ProductListFilter } from '@/components/categories/product-list-filter'
import {
    getCategoryId,
    GetCategoryId200MetadataItem,
    getProducts,
} from '@/http/api'
import { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'

type SearchPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const search = await searchParams

  if (!search.q) {
    redirect('/')
  }

  return {
    title: `Busca por ${search.q}`,
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams

  const q = typeof params.q === 'string' ? params.q : undefined

  const order =
    params.order === 'views'
      ? 'views'
      : params.order === 'price'
        ? 'price'
        : params.order === 'selling'
          ? 'selling'
          : undefined

  const { q: _q, order: _order, ...filters } = params

  const { categoryIds, error, products } = await getProducts({
    orderBy: order,
    limit: '8',
    metadata: JSON.stringify(filters),
    q,
  })

  if (error) {
    redirect('/')
  }

  const metadata: GetCategoryId200MetadataItem[] = []

  for (const i in categoryIds) {
    const meta = await getCategoryId(categoryIds[i].toString())

    if (meta.error) {
      return redirect('/')
    }

    metadata.push(...meta.metadata)
  }

  return (
    <div>
      <div className="my-4 text-base text-gray-500">
        <Link href="/">Home</Link> &gt; Busca por {q}
      </div>
      <ProductListFilter products={products} metadata={metadata} />
    </div>
  )
}
