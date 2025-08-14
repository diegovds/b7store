import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export function useQueryString() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  return {
    get: (att: string) => {
      return searchParams.get(att)
    },
    set: (att: string, val: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (val) {
        params.set(att, val)
      } else {
        params.delete(att)
      }
      router.push(`${pathname}?${params.toString()}`)
    },
  }
}
