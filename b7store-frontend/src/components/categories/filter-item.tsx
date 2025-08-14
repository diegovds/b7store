type FilterItemProps = {
  id: number
  label: string
}

export function FilterItem({ id, label }: FilterItemProps) {
  return (
    <div className="flex items-center gap-4">
      <input type="checkbox" className="size-6" id={`ck-${id}`} />
      <label htmlFor={`ck-${id}`} className="text-lg text-gray-500">
        {label}
      </label>
    </div>
  )
}
