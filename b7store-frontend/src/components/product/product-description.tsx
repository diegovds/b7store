'use client'

import Image from 'next/image'
import { useState } from 'react'

type ProductDescriptionProps = {
  text: string | null
}

export function ProductDescription({ text }: ProductDescriptionProps) {
  const [opened, setOpened] = useState(true)

  return (
    <div className="mt-20 border border-gray-200 bg-white p-7">
      <div
        className={`flex items-center justify-between ${opened ? 'border-b pb-7' : 'border-b-0'} border-b-gray-200`}
      >
        <div className="text-2xl font-medium">Informações do produto</div>
        <div
          onClick={() => setOpened(!opened)}
          className="flex size-14 cursor-pointer items-center justify-center rounded-sm border border-gray-200"
        >
          <Image
            src={`/assets/ui/arrow-left-s-line.png`}
            alt=""
            width={24}
            height={24}
            className={`duration-300 ${opened ? 'rotate-0' : 'rotate-180'}`}
          />
        </div>
      </div>
      <div
        className={`overflow-y-hidden text-base text-gray-500 duration-300 ${opened ? 'mt-7 max-h-screen' : 'max-h-0'}`}
      >
        {text}
      </div>
    </div>
  )
}
