'use server'

import { getCartShipping } from '@/http/api'

type ShippingInfoResponse = {
  zipcode: string
  cost: number
  days: number
}

export const getShippingInfo = async (
  zipcode: string,
): Promise<ShippingInfoResponse | false> => {
  try {
    const response = await getCartShipping({ zipcode })

    return !response.error ? response : false
  } catch {}

  return false
}
