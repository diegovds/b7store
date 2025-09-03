'use client'

import { GetUserAddresses200AddressItem } from '@/http/api'

type MyAddressesProps = {
  addresses: GetUserAddresses200AddressItem[]
}

export const MyAddresses = ({ addresses }: MyAddressesProps) => {
  return <div>meus endereços</div>
}
