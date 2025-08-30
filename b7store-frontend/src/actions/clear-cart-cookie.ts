'use server'

import { clearServerCart } from '@/libs/server-cookies'

export const clearCartCookie = async () => {
  await clearServerCart()
}
