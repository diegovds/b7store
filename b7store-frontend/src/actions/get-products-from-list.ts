'use server'

import { postCartMount } from '@/http/api'

export const getProductsFromList = async (ids: number[]) => {
  try {
    return await postCartMount({ ids })
  } catch {
    return null
  }
}
