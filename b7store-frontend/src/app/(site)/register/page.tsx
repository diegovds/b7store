import { getAuthState } from '@/actions/get-auth-state'
import { RegisterForm } from '@/components/auth/register-form'
import { redirect } from 'next/navigation'

export default async function RegisterPage() {
  const { token } = await getAuthState()

  if (token) {
    return redirect('/my-orders')
  }

  return (
    <div className="mx-auto max-w-md">
      <RegisterForm />
    </div>
  )
}
