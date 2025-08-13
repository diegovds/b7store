import { Banners } from '@/components/home/banners'
import { InformationIcon } from '@/components/home/information-icon'
import { MostSoldProducts } from '@/components/home/most-sold-products'
import { MostViewedProducts } from '@/components/home/most-viewed-products'
import { ProductListSkeleton } from '@/components/home/product-list-skeleton'
import { getBanners } from '@/http/api'
import { Suspense } from 'react'

export default async function Home() {
  const data = await getBanners()

  return (
    <div className="">
      <Banners list={data.banners} />
      <div className="mt-6 flex flex-col gap-4 md:mt-12 md:flex-row md:gap-8">
        <InformationIcon
          icon="/assets/ui/truck-line.png"
          title="Frete Grátis"
          description="Para todo o Nordeste."
        />
        <InformationIcon
          icon="/assets/ui/discount-percent-line.png"
          title="Muitas ofertas"
          description="Ofertas imbátiveis."
        />
        <InformationIcon
          icon="/assets/ui/arrow-left-right-line.png"
          title="Troca fácil"
          description="No período de 30 dias."
        />
      </div>
      <Suspense fallback={<ProductListSkeleton />}>
        <MostViewedProducts />
      </Suspense>
      <Suspense fallback={<ProductListSkeleton />}>
        <MostSoldProducts />
      </Suspense>
    </div>
  )
}
