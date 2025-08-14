import { ProductListFilter } from '@/components/categories/product-list-filter'
import { getCategorySlugMetadata, getProducts } from '@/http/api'
import Link from 'next/link'

type CategoriesProps = {
  params: Promise<{ slug: string }>
  searcgParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Categories({
  params,
  searcgParams,
}: CategoriesProps) {
  const { slug } = await params
  const filters = await searcgParams

  const { category } = await getCategorySlugMetadata(slug)
  const { products } = await getProducts()

  return (
    <div>
      <div className="my-4 text-base text-gray-500">
        <Link href="/">Home</Link> &gt; {category?.name}
      </div>
      <ProductListFilter products={products} />
    </div>
  )
}
