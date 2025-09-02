'use client'

import { getShippingInfo } from '@/actions/get-shipping-info'
import { getUserAddresses, GetUserAddresses200AddressItem } from '@/http/api'
import { useAuthStore } from '@/store/auth'
import { useCartStore } from '@/store/cart'
import { useEffect, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'

export const ShippingBoxLogged = () => {
  const { token, hydrated } = useAuthStore()
  const {
    shippingZipcode,
    clearShipping,
    selectedAdressId,
    setShippingCost,
    setShippingDays,
    setShippingZipcode,
    setSelectedAddressId,
  } = useCartStore()
  const [addresses, setAddresses] = useState<
    GetUserAddresses200AddressItem[] | []
  >([])

  useEffect(() => {
    const fetchAddresses = async () => {
      const response = await getUserAddresses({
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.address) {
        setAddresses(response.address)
      }
    }

    if (token && hydrated) {
      fetchAddresses()
    }
  }, [token, hydrated])

  useEffect(() => {
    const updateShippingInfo = async () => {
      if (shippingZipcode.length > 4) {
        const shippingInfo = await getShippingInfo(shippingZipcode)
        if (shippingInfo) {
          setShippingCost(shippingInfo.cost)
          setShippingDays(shippingInfo.days)
        }
      }
    }

    if (selectedAdressId) {
      updateShippingInfo()
    }
  }, [selectedAdressId, setShippingCost, setShippingDays, shippingZipcode])

  const handleSelectAddress = (value: string) => {
    clearShipping()
    const address = addresses.find((a) => a.id.toString() === value)
    if (address) {
      setShippingZipcode(address.zipcode)
      setSelectedAddressId(parseInt(value))
    }
  }

  return (
    <div className="flex gap-4">
      <Select onValueChange={handleSelectAddress}>
        <SelectTrigger className="h-full flex-1 px-6 py-8">
          <SelectValue placeholder="Selecione um endereço" />
        </SelectTrigger>
        <SelectContent className="rounded-sm border border-gray-200 bg-white">
          {addresses.map((address) => (
            <SelectItem key={address.id} value={address.id.toString()}>
              {`${address.street}, ${address.number} - ${address.city} (${address.zipcode})`}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <button className="cursor-pointer rounded-sm border-0 bg-blue-600 px-6 py-5 text-white">
        +
      </button>
    </div>
  )
}
