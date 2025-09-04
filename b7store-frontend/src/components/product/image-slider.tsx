'use client'

import Image from 'next/image'
import { useState } from 'react'

type ImageSliderProps = {
  images: string[]
}

export function ImageSlider({ images }: ImageSliderProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  const handleThumbnailClick = (index: number) => {
    setSelectedImageIndex(index)
  }

  return (
    <div className="max-w-sm space-y-8">
      <div className="w-full border border-gray-300 bg-white p-14">
        <Image
          src={images[selectedImageIndex]}
          alt=""
          width={380}
          height={380}
        />
      </div>
      <div className="mx-auto grid grid-cols-4 gap-6 md:mx-0">
        {images.map((image, index) => (
          <div
            key={index}
            onClick={() => handleThumbnailClick(index)}
            className={`cursor-pointer border bg-white p-2 ${index === selectedImageIndex ? 'border-blue-500' : 'border-gray-300'}`}
          >
            <Image src={image} alt="" width={120} height={120} />
          </div>
        ))}
      </div>
    </div>
  )
}
