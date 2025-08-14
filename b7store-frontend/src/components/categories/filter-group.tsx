'use client'

import { GetCategorySlugMetadata200MetadataItemValuesItem } from '@/http/api'
import Image from 'next/image'
import { useState } from 'react'
import { FilterItem } from './filter-item'

type FilterGroupProps = {
  groupId: string
  groupName: string
  filters: GetCategorySlugMetadata200MetadataItemValuesItem[]
}

export function FilterGroup({ filters, groupName, groupId }: FilterGroupProps) {
  const [opened, setOpened] = useState(true)

  return (
    <div className="mb-8">
      <div
        className={`mb-4 flex items-center justify-between border-b border-gray-200 pb-4`}
      >
        <div className="flex-1 text-xl font-medium">{groupName}</div>
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
        {filters.map((filter) => (
          <FilterItem
            key={filter.id}
            item={{ id: filter.id, label: filter.label }}
            groupId={groupId}
          />
        ))}
      </div>
    </div>
  )
}
