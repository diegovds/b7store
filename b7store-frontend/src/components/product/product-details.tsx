'use client'

import { setCartState } from '@/actions/set-cart-state'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { getCartShipping } from '@/http/api'
import { formatZipcode } from '@/libs/format-zipcode'
import { useCartStore } from '@/store/cart'
import { ProductComplete } from '@/types/product'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

type ProductDetailsProps = {
  product: ProductComplete
}

const freightSchema = z.object({
  zipcode: z
    .string()
    .min(8, 'Digite um CEP válido')
    .max(9, 'Digite um CEP válido')
    .regex(/^\d{5}-?\d{3}$/, 'CEP inválido'),
})

type FreightFormData = z.infer<typeof freightSchema>

export function ProductDetails({ product }: ProductDetailsProps) {
  const [liked, setLiked] = useState(product.liked)
  const { addItem } = useCartStore()
  const [freight, setFreight] = useState<{
    cost?: number
    days?: number
    error?: string
  }>({})

  const form = useForm<FreightFormData>({
    resolver: zodResolver(freightSchema),
    defaultValues: { zipcode: '' },
  })

  const addToCart = async () => {
    addItem({ productId: product.id, quantity: 1 })
    const updatedCart = useCartStore.getState().cart
    await setCartState(updatedCart)
    redirect('/cart')
  }

  const onSubmit = async ({ zipcode }: FreightFormData) => {
    try {
      const code = formatZipcode(zipcode)
      const { cost, days, error } = await getCartShipping({
        zipcode: code,
      })
      setFreight({
        cost,
        days,
        error: error || undefined,
      })
    } catch {
      setFreight({ error: 'Erro ao calcular frete' })
    }
  }

  return (
    <div className="flex-1 space-y-4">
      <div className="text-xs text-gray-500">Cód. {product.id}</div>
      <div className="text-2xl font-medium md:text-3xl">{product.label}</div>
      <div className="text-4xl font-medium text-blue-600">
        R$ {product.price.toFixed(2)}
      </div>
      <div className="text-sm text-gray-500">Em até 12X no cartão</div>
      <div className="flex gap-4">
        <button
          onClick={addToCart}
          className="flex-1 cursor-pointer rounded-sm border-0 bg-blue-600 py-4 text-white duration-300 hover:bg-blue-700 md:max-w-xs md:px-8"
        >
          Adicionar ao carrinho
        </button>
        <div
          onClick={() => setLiked(!liked)}
          className="flex size-14 cursor-pointer items-center justify-center rounded-sm border border-gray-200 bg-white"
        >
          <Image
            src={
              liked
                ? `/assets/ui/heart-3-fill.png`
                : `/assets/ui/heart-3-line.png`
            }
            alt="Favoritar"
            width={24}
            height={24}
          />
        </div>
        <div className="flex size-14 cursor-pointer items-center justify-center rounded-sm border border-gray-200 bg-white">
          <Image
            src={`/assets/ui/share-line.png`}
            alt="Compartilhar"
            width={24}
            height={24}
          />
        </div>
      </div>
      <div className="mt-10 border-t border-gray-200 pt-10">
        <div className="mb-4 text-base text-gray-500">
          Calcular frete e prazo
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-row gap-6"
          >
            <FormField
              control={form.control}
              name="zipcode"
              render={({ field }) => (
                <FormItem className="flex-1 md:w-[359px] md:flex-none">
                  <FormControl>
                    <input
                      type="text"
                      placeholder="Digite aqui o CEP"
                      {...field}
                      className="flex-1 rounded-sm border border-gray-200 px-4 py-3 text-base outline-none md:w-[359px] md:flex-none"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <button
              disabled={form.formState.isSubmitting}
              type="submit"
              className="flex-1 cursor-pointer rounded-sm border-0 bg-blue-600 py-4 text-white duration-300 hover:bg-blue-700 disabled:cursor-default disabled:bg-blue-600 disabled:opacity-80 disabled:hover:opacity-80 md:flex-none md:px-8"
            >
              Calcular
            </button>
          </form>
        </Form>

        {freight.error && (
          <p className="mt-4 w-fit rounded-sm border border-gray-200 px-4 py-3 text-red-500">
            {freight.error}
          </p>
        )}

        {freight.cost !== undefined && freight.days !== undefined && (
          <p className="mt-4 w-fit rounded-sm border border-gray-200 px-4 py-3 text-gray-700">
            Frete: R$ {freight.cost.toFixed(2)} - Entrega em {freight.days} dia
            {freight.days > 1 ? 's' : ''}
          </p>
        )}
      </div>
    </div>
  )
}
