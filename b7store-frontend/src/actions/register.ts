'use server'

import { postUserRegister } from '@/http/api'

type RegisterData = {
  name: string
  email: string
  password: string
}

export const register = async ({
  name,
  email,
  password,
}: RegisterData): Promise<{ error: string | null }> => {
  try {
    const response = await postUserRegister({ name, email, password })
    if (response.error) return { error: 'Erro ao fazer cadastro.' }
    return {
      error: null,
    }
  } catch {}
  return { error: 'Erro ao fazer cadastro.' }
}
