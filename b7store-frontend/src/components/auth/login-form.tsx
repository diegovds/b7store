'use client'

import { login } from '@/actions/login'
import { setAuthCookie } from '@/actions/set-auth-cookie'
import { useAuthStore } from '@/store/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { redirect } from 'next/navigation'
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

const loginSchema = z.object({
  email: z.email('E-mail inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
})

type LoginFormData = z.infer<typeof loginSchema>

export const LoginForm = () => {
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const { setToken } = useAuthStore()

  const onSubmit = async (data: LoginFormData) => {
    const res = await login(data)

    if (res.error) {
      toast.error(res.error)
    } else if (res.token) {
      await setAuthCookie(res.token)
      setToken(res.token)
      redirect('/')
    }
  }

  return (
    <PageForm
      title="Faça o seu login"
      subtitle="Insira seus dados e faça login"
      logo="/assets/ui/logo-black.png"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-4"
        >
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
                <div className="flex items-center justify-between">
                  <FormLabel className="text-sm text-gray-500">Senha</FormLabel>
                  <Link
                    href="/forgot-password"
                    className="text-sm font-medium text-blue-600 hover:underline"
                  >
                    Esqueceu sua senha?
                  </Link>
                </div>
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
          <button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="mt-2 w-full cursor-pointer rounded bg-blue-600 py-2 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {form.formState.isSubmitting ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </Form>

      <p className="mt-6 text-center text-base text-gray-500">
        Não tem cadastro?{' '}
        <Link href="/register" className="text-blue-600 hover:underline">
          Cadastre-se aqui
        </Link>
      </p>
    </PageForm>
  )
}
