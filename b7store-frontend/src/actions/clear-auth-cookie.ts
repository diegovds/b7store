'use server'

import { clearServerAuthToken } from '@/libs/server-cookies'

export const clearAuthCookie = async () => {
  await clearServerAuthToken()
}
