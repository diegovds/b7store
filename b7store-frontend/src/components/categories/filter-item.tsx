'use client'

import { useQueryString } from '@/hooks/use-querystring'

type FilterItemProps = {
  groupId: string
  item: {
    id: string
    label: string
  }
}

export function FilterItem({ groupId, item }: FilterItemProps) {
  const queryString = useQueryString()

  const toggleFilter = (groupId: string, itemId: string) => {
    const queryGroup = queryString.get(groupId)
    let currentFilters = queryGroup ? queryGroup.split('|') : []

    if (currentFilters.includes(itemId)) {
      currentFilters = currentFilters.filter((i) => i !== itemId)
    } else {
      currentFilters.push(itemId)
    }

    queryString.set(groupId, currentFilters.join('|'))
  }

  const hasFilter = (groupId: string, itemId: string) => {
    const currentFilters = queryString.get(groupId)?.split('|')
    return !!(currentFilters && currentFilters.includes(itemId))
  }

  return (
    <div className="flex items-center gap-4">
      <input
        type="checkbox"
        className="size-6"
        id={`ck-${item.id}`}
        onChange={() => toggleFilter(groupId, item.id)}
        checked={hasFilter(groupId, item.id)}
      />
      <label htmlFor={`ck-${item.id}`} className="text-lg text-gray-500">
        {item.label}
      </label>
    </div>
  )
}
