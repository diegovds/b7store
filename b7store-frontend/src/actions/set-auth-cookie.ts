'use server'

import { setServerAuthToken } from '@/libs/server-cookies'

export const setAuthCookie = async (token: string) => {
  await setServerAuthToken(token)
}
