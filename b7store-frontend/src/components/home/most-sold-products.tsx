import { getProducts } from '@/http/api'
import { ProductList } from '../product-list'

export async function MostSoldProducts() {
  const { products } = await getProducts({ orderBy: 'selling', limit: '4' })

  return (
    <div className="mt-12 pb-10 md:mt-[69px]">
      <div className="flex flex-col items-center gap-0.5 md:items-start">
        <h2 className="text-[18px] font-medium md:text-2xl">
          Produtos mais vendidos
        </h2>
        <p className="text-xs text-gray-500 md:text-base">
          Campeões de vendas da nossa loja.
        </p>
      </div>

      <ProductList list={products} />
    </div>
  )
}
