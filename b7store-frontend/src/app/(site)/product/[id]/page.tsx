import { ProductListSkeleton } from '@/components/home/product-list-skeleton'
import { ImageSlider } from '@/components/product/image-slider'
import { ProductDescription } from '@/components/product/product-description'
import { ProductDetails } from '@/components/product/product-details'
import { RelatedProducts } from '@/components/product/related-products'
import { getProductId } from '@/http/api'
import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

type ProductPageProps = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params

  const { product } = await getProductId(id)

  if (!product) {
    notFound()
  }

  return {
    title: product.label,
    description: product.description,
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params

  const { product } = await getProductId(id)

  if (!product) {
    return notFound()
  }

  return (
    <div>
      <div className="mt-2 mb-8 text-base text-gray-500 md:mt-6 md:mb-12">
        <Link href="/">Home</Link> &gt;{' '}
        <Link href="/categories/camisetas">Camisetas</Link> &gt; {product.label}
      </div>
      <div className="flex flex-col gap-6 md:flex-row md:gap-32">
        <ImageSlider images={product.images} />
        <ProductDetails product={product} />
      </div>
      <ProductDescription text={product.description} />
      <Suspense fallback={<ProductListSkeleton text={false} />}>
        <RelatedProducts id={product.id.toString()} />
      </Suspense>
    </div>
  )
}
