'use client'

import Image from 'next/image'
import { useState } from 'react'
import { FilterItem } from './filter-item'

export function FilterGroup() {
  const [opened, setOpened] = useState(true)

  return (
    <div className="mb-8">
      <div
        className={`mb-4 flex items-center justify-between border-b border-gray-200 pb-4`}
      >
        <div className="flex-1 text-xl font-medium">Nome do grupo</div>
        <div
          onClick={() => setOpened(!opened)}
          className="flex size-8 cursor-pointer items-center justify-center"
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
        className={`space-y-4 overflow-y-hidden ${opened ? 'max-h-screen' : 'max-h-0'} duration-300`}
      >
        <FilterItem id={1} label={'Item 1'} />
        <FilterItem id={2} label={'Item 2'} />
        <FilterItem id={3} label={'Item 3'} />
      </div>
    </div>
  )
}
