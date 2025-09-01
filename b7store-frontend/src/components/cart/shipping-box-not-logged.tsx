'use client'

import { getShippingInfo } from '@/actions/get-shipping-info'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useCartStore } from '@/store/cart'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const zipcodeSchema = z.object({
  zipcode: z
    .string()
    .min(9, 'CEP inválido')
    .regex(/^\d{5}-\d{3}$/, 'Formato de CEP inválido'),
})

type ZipcodeFormData = z.infer<typeof zipcodeSchema>

export function ShippingBoxNotLogged() {
  const {
    shippingZipcode,
    setShippingZipcode,
    setShippingCost,
    setShippingDays,
  } = useCartStore()

  const form = useForm<ZipcodeFormData>({
    resolver: zodResolver(zipcodeSchema),
    defaultValues: {
      zipcode: shippingZipcode || '',
    },
  })

  const handleZipcodeChange = (value: string) => {
    let v = value.replace(/\D/g, '').slice(0, 8)
    if (v.length > 5) {
      v = v.replace(/^(\d{5})(\d{0,3})$/, '$1-$2')
    }
    return v
  }

  const onSubmit = async ({ zipcode }: ZipcodeFormData) => {
    const shippingInfo = await getShippingInfo(zipcode)
    if (shippingInfo) {
      setShippingCost(shippingInfo.cost)
      setShippingDays(shippingInfo.days)
      setShippingZipcode(zipcode)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex items-start gap-4"
      >
        <FormField
          control={form.control}
          name="zipcode"
          render={({ field }) => (
            <FormItem className="min-h-full flex-1">
              <FormControl>
                <Input
                  className="bg-white px-6 py-8"
                  placeholder="00000-000"
                  value={field.value}
                  onChange={(e) =>
                    field.onChange(handleZipcodeChange(e.target.value))
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <button
          disabled={form.formState.isSubmitting}
          type="submit"
          className="cursor-pointer rounded-sm border-0 bg-blue-600 px-6 py-5 text-center text-white"
        >
          Calcular
        </button>
      </form>
    </Form>
  )
}
