import { Banner } from '@/types/banner'
import Image from 'next/image'
import Link from 'next/link'

type BannersProps = {
  list: Banner[]
}

export function Banners({ list }: BannersProps) {
  return (
    <div>
      <div className="relative aspect-[3/1]">
        {list.map((banner, index) => (
          <Link
            key={index}
            href={banner.link}
            className="absolute inset-0 duration-300"
          >
            <Image
              src={banner.img}
              alt=""
              width={1200}
              height={400}
              className="rounded-sm"
            />
          </Link>
        ))}
      </div>
      <div>.... botoes</div>
    </div>
  )
}
