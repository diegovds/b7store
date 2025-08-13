import { Banners } from '@/components/home/banners'
import { getBanners } from '@/http/api'

export default async function Home() {
  const data = await getBanners()

  return (
    <div>
      <Banners list={data.banners} />
    </div>
  )
}
