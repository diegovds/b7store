'use client'

import { getUserAddresses, GetUserAddresses200AddressItem } from '@/http/api'
import { useAuthStore } from '@/store/auth'
import { useEffect, useState } from 'react'

export const ShippingBoxLogged = () => {
  const { token } = useAuthStore()
  const [addresses, setAddresses] = useState<
    GetUserAddresses200AddressItem[] | null
  >(null)

  useEffect(() => {
    const fetchAddresses = async () => {
      const response = await getUserAddresses({
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.address) {
        setAddresses(response.address)
      }
    }

    if (token) {
      fetchAddresses()
    }
  }, [token])

  console.log(addresses)

  return <div>...</div>
}
