'use client'

import { register } from '@/actions/register'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { Input } from '../ui/input'
import { PageForm } from './components/page-form'

const registerSchema = z
  .object({
    name: z.string().min(6, 'O nome deve ter no mínimo 6 caracteres'),
    email: z.email('E-mail inválido'),
    password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })

type RegisterFormData = z.infer<typeof registerSchema>

export const RegisterForm = () => {
  const router = useRouter()
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (data: RegisterFormData) => {
    const res = await register(data)

    if (res.error) {
      toast.error(res.error)
    } else {
      router.push('/login')
    }
  }

  return (
    <PageForm
      title="Faça o seu cadastro"
      subtitle="Insira seus dados e faça cadastro"
      logo="/assets/ui/logo-black.png"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-sm text-gray-500">Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Digite seu nome" type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-sm text-gray-500">E-mail</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Digite seu e-mail"
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-sm text-gray-500">Senha</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Digite sua senha"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-sm text-gray-500">
                  Confirme a senha
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Digite a confirmação de senha"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="mt-2 w-full cursor-pointer rounded bg-blue-600 py-2 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {form.formState.isSubmitting ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>
      </Form>

      <p className="mt-6 text-center text-base text-gray-500">
        Já tem cadastro?{' '}
        <Link href="/login" className="text-blue-600 hover:underline">
          Entre aqui
        </Link>
      </p>
    </PageForm>
  )
}
