import { RegisterForm } from '@/components/auth/register-form'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cadastro',
}

export default async function RegisterPage() {
  return (
    <div className="mx-auto max-w-md">
      <RegisterForm />
    </div>
  )
}
