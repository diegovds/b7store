'use client'

import { getShippingInfo } from '@/actions/get-shipping-info'
import { getUserAddresses } from '@/http/api'
import { useAuthStore } from '@/store/auth'
import { useCartStore } from '@/store/cart'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { AddressModal } from './address-modal'

type UseAddressesProps = {
  token: string | null
  hydrated: boolean
}

export const ShippingBoxLogged = () => {
  const { token, hydrated } = useAuthStore()
  const [modalOpened, setModalOpened] = useState(false)
  const {
    shippingZipcode,
    clearShipping,
    selectedAdressId,
    setShippingCost,
    setShippingDays,
    setShippingZipcode,
    setSelectedAddressId,
  } = useCartStore()

  function useAddresses({ token, hydrated }: UseAddressesProps) {
    return useQuery({
      queryKey: ['user-addresses', token],
      queryFn: async () => {
        if (!token) return []
        const response = await getUserAddresses({
          headers: { Authorization: `Bearer ${token}` },
        })
        return response.address ?? []
      },
      enabled: !!token && hydrated,
    })
  }

  const { data: addresses = [] } = useAddresses({ token, hydrated })

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
    <div className="flex flex-col gap-4">
      <Select onValueChange={handleSelectAddress}>
        <SelectTrigger className="w-full px-6 py-8">
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
      <button
        onClick={() => setModalOpened(true)}
        className="text-blck cursor-pointer"
      >
        Adicionar novo endereço
      </button>
      <AddressModal open={modalOpened} onClose={() => setModalOpened(false)} />
    </div>
  )
}
