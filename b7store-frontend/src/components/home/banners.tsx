'use client'

import { Banner } from '@/types/banner'
import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'

type BannersProps = {
  list: Banner[]
}

let bannerTimer: NodeJS.Timeout

export function Banners({ list }: BannersProps) {
  const [currentImage, setCurrentImage] = useState(0)

  const nextImage = useCallback(() => {
    setCurrentImage((current) => (current + 1 >= list.length ? 0 : current + 1))
  }, [list.length])

  const handleBannerClick = (index: number) => {
    setCurrentImage(index)

    clearInterval(bannerTimer)
    bannerTimer = setInterval(nextImage, 5000)
  }

  useEffect(() => {
    bannerTimer = setInterval(nextImage, 5000)

    return () => clearInterval(bannerTimer)
  }, [nextImage])

  return (
    <div>
      <div className="relative aspect-[3/1]">
        {list.map((banner, index) => (
          <Link
            key={index}
            href={banner.link}
            className={`absolute inset-0 duration-1000`}
            style={{ opacity: currentImage === index ? 1 : 0 }}
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
      <div className="mt-4 flex justify-center gap-4">
        {list.map((banner, index) => (
          <div
            key={index}
            className="size-4 cursor-pointer rounded-full bg-blue-600 duration-1000"
            style={{ opacity: currentImage === index ? 1 : 0.3 }}
            onClick={() => handleBannerClick(index)}
          />
        ))}
      </div>
    </div>
  )
}
