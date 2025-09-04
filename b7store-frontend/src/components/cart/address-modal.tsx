'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { postUserAddresses } from '@/http/api'
import { useAuthStore } from '@/store/auth'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

const newAddressSchema = z.object({
  street: z.string().min(3, 'Informe a rua'),
  number: z.string().min(1, 'Número obrigatório'),
  complement: z.string().nullable(),
  city: z.string().min(2, 'Cidade obrigatória'),
  state: z.string().min(2, 'Estado obrigatório'),
  country: z.string().min(2, 'País obrigatório'),
  zipcode: z.string().regex(/^\d{5}-?\d{3}$/, 'CEP inválido'),
})

type NewAddressFormValues = z.infer<typeof newAddressSchema>

type AddressModalProps = {
  open: boolean
  onClose: () => void
}

export const AddressModal = ({ onClose, open }: AddressModalProps) => {
  const { token } = useAuthStore()
  const queryClient = useQueryClient()
  const form = useForm<NewAddressFormValues>({
    resolver: zodResolver(newAddressSchema),
    defaultValues: {
      street: '',
      number: '',
      complement: '',
      city: '',
      state: '',
      country: '',
      zipcode: '',
    },
  })

  if (!open) return null

  const formatZipcode = (zipcode: string) => {
    const onlyNumbers = zipcode.replace(/\D/g, '')

    if (onlyNumbers.length === 8) {
      return onlyNumbers.replace(/(\d{5})(\d{3})/, '$1-$2')
    }

    return zipcode
  }

  const onSubmit = async (data: NewAddressFormValues) => {
    try {
      const payload = {
        ...data,
        complement: data.complement?.trim() === '' ? null : data.complement,
        zipcode: formatZipcode(data.zipcode),
      }

      const newAddress = await postUserAddresses(payload, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (newAddress.address) {
        onClose()
        queryClient.invalidateQueries({ queryKey: ['user-addresses', token] })
        form.reset()
      }
    } catch {
      toast.error('Erro ao cadastrar endereço')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
      <div className="relative m-4 w-full max-w-md rounded bg-white p-6">
        <h2 className="mb-4 text-center text-2xl font-medium">
          Adicionar endereço
        </h2>
        <button
          onClick={() => {
            onClose()
            form.reset()
          }}
          className="absolute top-0 right-4 cursor-pointer text-4xl text-black"
        >
          &times;
        </button>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid w-full max-w-lg gap-4"
          >
            <FormField
              control={form.control}
              name="street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rua</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex.: Av. Paulista" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 items-start gap-4">
              <FormField
                control={form.control}
                name="number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número</FormLabel>
                    <FormControl>
                      <Input placeholder="123" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="complement"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Complemento</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Apto 45, Bloco B"
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 items-start gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cidade</FormLabel>
                    <FormControl>
                      <Input placeholder="São Paulo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <FormControl>
                      <Input placeholder="SP" maxLength={2} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>País</FormLabel>
                  <FormControl>
                    <Input placeholder="Brasil" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="zipcode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CEP</FormLabel>
                  <FormControl>
                    <Input placeholder="00000-000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full cursor-pointer rounded-sm border-0 bg-blue-600 px-8 py-4 text-white duration-300 hover:bg-blue-700"
            >
              Salvar endereço
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
