import { getProductIdRelated } from '@/http/api'
import { ProductList } from '../product-list'

type RelatedProductsProps = {
  id: string
}

export async function RelatedProducts({ id }: RelatedProductsProps) {
  const { products } = await getProductIdRelated(id)

  return (
    <div className="my-10">
      <h3 className="text-xl font-medium md:text-2xl">
        Você também vai gostar
      </h3>
      <ProductList list={products} />
    </div>
  )
}
