type ProductListSkeletonProps = {
  text: boolean
}

export function ProductListSkeleton({ text }: ProductListSkeletonProps) {
  return (
    <div className="mt-12 md:mt-[69px]">
      <div className="flex flex-col items-center gap-4 md:items-start">
        <div className="h-8 w-52 animate-pulse rounded bg-gray-200" />
        {text && <div className="h-5 w-64 animate-pulse rounded bg-gray-200" />}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 md:mt-10 md:grid-cols-4">
        <div className="h-96 animate-pulse rounded bg-gray-200" />
        <div className="h-96 animate-pulse rounded bg-gray-200" />
        <div className="h-96 animate-pulse rounded bg-gray-200" />
        <div className="h-96 animate-pulse rounded bg-gray-200" />
      </div>
    </div>
  )
}
