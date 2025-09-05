'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getUserAddresses, GetUserAddresses200AddressItem } from '@/http/api'
import { useAuthStore } from '@/store/auth'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { AddressModal } from '../cart/address-modal'

type MyAddressesProps = {
  addresses: GetUserAddresses200AddressItem[]
}

type UseAddressesProps = {
  token: string | null
  hydrated: boolean
}

export const MyAddresses = ({ addresses }: MyAddressesProps) => {
  const [modalOpened, setModalOpened] = useState(false)
  const { token, hydrated } = useAuthStore()

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

  const { data: _addresses = addresses } = useAddresses({ token, hydrated })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium">
          Você possui {_addresses.length}{' '}
          {_addresses.length !== 1 ? 'endereços' : 'endereço'}:
        </h2>
        <button
          onClick={() => setModalOpened(true)}
          className="cursor-pointer rounded-sm border-0 bg-blue-600 px-4 py-2 text-white duration-300 hover:bg-blue-700"
        >
          Adicionar endereço
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {_addresses.map((address) => (
          <Card key={address.id} className="border border-gray-200 shadow-none">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                {address.street}, {address.number}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm text-gray-700">
              {address.complement && (
                <p>
                  <span className="font-medium">Complemento:</span>{' '}
                  {address.complement}
                </p>
              )}
              <p>
                <span className="font-medium">Cidade:</span> {address.city} -{' '}
                {address.state}
              </p>
              <p>
                <span className="font-medium">CEP:</span> {address.zipcode}
              </p>
              <p>
                <span className="font-medium">País:</span> {address.country}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      <AddressModal open={modalOpened} onClose={() => setModalOpened(false)} />
    </div>
  )
}
