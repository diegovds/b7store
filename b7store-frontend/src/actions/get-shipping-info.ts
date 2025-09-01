'use server'

type ShippingInfoResponse = {
  zipcode: string
  cost: number
  days: number
}

export const getShippingInfo = async (
  zipcode: string,
): Promise<ShippingInfoResponse | false> => {
  // todo

  return {
    zipcode,
    cost: 100,
    days: 4,
  }
}
