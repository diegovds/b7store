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
    <div className="w-full">
      <div className="relative aspect-[3/1] overflow-hidden rounded-sm">
        <div
          className="flex h-full transition-transform duration-1000 ease-in-out"
          style={{ transform: `translateX(-${currentImage * 100}%)` }}
        >
          {list.map((banner, index) => (
            <Link
              key={index}
              href={banner.link}
              className="h-full w-full flex-shrink-0"
            >
              <Image
                src={banner.img}
                alt=""
                width={1200}
                height={400}
                className="h-full w-full object-cover"
              />
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-4 flex justify-center gap-4">
        {list.map((_, index) => (
          <button
            key={index}
            onClick={() => handleBannerClick(index)}
            className={`size-4 cursor-pointer rounded-full duration-300 ${
              currentImage === index ? 'bg-blue-600' : 'bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
