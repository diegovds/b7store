import { Product } from '@/types/product'
import { ProductItem } from './product-item'

type ProductListProps = {
  list: Product[]
}

export function ProductList({ list }: ProductListProps) {
  return (
    <div className="mt-8 grid grid-cols-1 gap-8 md:mt-10 md:grid-cols-4">
      {list.map((item: Product) => (
        <ProductItem key={item.id} {...item} />
      ))}
    </div>
  )
}
