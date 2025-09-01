'use server'

type LoginData = {
  email: string
  password: string
}

export const login = async ({
  email,
  password,
}: LoginData): Promise<{ error: string | null; token?: string }> => {
  // todo: requisição

  return { error: null, token: '123' }
}
