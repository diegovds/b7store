import { LoginForm } from '@/components/auth/login-form'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Entrar',
}

export default async function LoginPage() {
  return (
    <div className="mx-auto max-w-md">
      <LoginForm />
    </div>
  )
}
