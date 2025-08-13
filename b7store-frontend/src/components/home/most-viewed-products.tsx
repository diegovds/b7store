import { getProducts } from '@/http/api'
import { ProductList } from '../product-list'

export async function MostViewedProducts() {
  const { products } = await getProducts({ orderBy: 'views' })

  return (
    <div className="mt-12 md:mt-[69px]">
      <div className="flex flex-col items-center gap-4 md:items-start">
        <h2 className="text-[18px] font-medium md:text-2xl">
          Produtos mais vistos
        </h2>
        <p className="text-base text-gray-500">
          Campeões de visualização da nossa loja.
        </p>
      </div>

      <ProductList list={products} />
    </div>
  )
}
