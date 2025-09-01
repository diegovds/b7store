'use server'

import { postUserLogin } from '@/http/api'

type LoginData = {
  email: string
  password: string
}

export const login = async ({
  email,
  password,
}: LoginData): Promise<{ error: string | null; token?: string }> => {
  try {
    const response = await postUserLogin({ email, password })
    if (response.error) return { error: 'Erro ao fazer login.' }
    return {
      error: null,
      token: response.token,
    }
  } catch {}
  return { error: 'Erro ao fazer login.' }
}
