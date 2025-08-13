import { Banners } from '@/components/home/banners'
import { InformationIcon } from '@/components/home/information-icon'
import { getBanners } from '@/http/api'

export default async function Home() {
  const data = await getBanners()

  return (
    <div>
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
    </div>
  )
}
