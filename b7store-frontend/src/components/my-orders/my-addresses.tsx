'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { GetUserAddresses200AddressItem } from '@/http/api'

type MyAddressesProps = {
  addresses: GetUserAddresses200AddressItem[]
}

export const MyAddresses = ({ addresses }: MyAddressesProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">
        Você possui {addresses.length}{' '}
        {addresses.length !== 1 ? 'endereços' : 'endereço'}:
      </h2>

      <div className="grid gap-4 md:grid-cols-2">
        {addresses.map((address) => (
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
    </div>
  )
}
