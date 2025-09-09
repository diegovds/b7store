import { getAuthState } from '@/actions/get-auth-state'
import { LoginForm } from '@/components/auth/login-form'
import { redirect } from 'next/navigation'

export default async function LoginPage() {
  const { token } = await getAuthState()

  if (token) {
    redirect('/my-orders')
  }

  return (
    <div className="mx-auto max-w-md">
      <LoginForm />
    </div>
  )
}
