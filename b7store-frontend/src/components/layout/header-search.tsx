'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { redirect } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const searchSchema = z.object({
  search: z
    .string()
    .min(1, 'Digite algo para buscar')
    .max(100, 'Máximo de 100 caracteres'),
})

type SearchSchema = z.infer<typeof searchSchema>

export function HeaderSearch() {
  const { register, handleSubmit } = useForm<SearchSchema>({
    resolver: zodResolver(searchSchema),
  })

  const onSubmit = ({ search }: SearchSchema) => {
    redirect(`/search?q=${search}`)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <input
        type="search"
        {...register('search')}
        className="w-full rounded-sm border border-gray-200 bg-[url(/assets/ui/search.png)] bg-[size:24px] bg-[12px_50%] bg-no-repeat py-3 pr-4 pl-12 text-base outline-none"
        placeholder="O que você procura?"
      />
    </form>
  )
}
