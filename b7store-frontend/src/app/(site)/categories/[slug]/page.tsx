import { ProductListFilter } from '@/components/categories/product-list-filter'
import { getCategorySlugMetadata, getProducts } from '@/http/api'
import { Metadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'

type CategoriesProps = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({
  params,
}: CategoriesProps): Promise<Metadata> {
  const { slug } = await params

  const { category } = await getCategorySlugMetadata(slug)

  if (!category?.name) {
    notFound()
  }

  return {
    title: category.name,
  }
}

export default async function CategoriesPage({
  params,
  searchParams,
}: CategoriesProps) {
  const { slug } = await params
  const filters = await searchParams
  const order =
    filters.order === 'views'
      ? 'views'
      : filters.order === 'price'
        ? 'price'
        : filters.order === 'selling'
          ? 'selling'
          : undefined

  const { category, metadata } = await getCategorySlugMetadata(slug)
  filters.order = undefined
  const { products, error } = await getProducts({
    orderBy: order,
    limit: '8',
    metadata: JSON.stringify(filters),
    categoryId: category?.id.toString(),
  })

  if (error) {
    return redirect('/')
  }

  return (
    <div>
      <div className="my-4 text-base text-gray-500">
        <Link href="/">Home</Link> &gt; {category?.name}
      </div>
      <ProductListFilter products={products} metadata={metadata} />
    </div>
  )
}
