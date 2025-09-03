'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { GetUserAddresses200AddressItem } from '@/http/api'

type MyAddressesProps = {
  addresses: GetUserAddresses200AddressItem[]
}

export const MyAddresses = ({ addresses }: MyAddressesProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">
        Você possui {addresses.length}{' '}
        {addresses.length !== 1 ? 'endereços' : 'endereço'}
      </h2>

      <Accordion type="single" collapsible className="w-full">
        {addresses.map((address) => (
          <AccordionItem key={address.id} value={address.id.toString()}>
            <AccordionTrigger>
              {address.street}, {address.number}
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-1 text-sm text-gray-700">
                <p>
                  <span className="font-medium">Rua:</span> {address.street}
                </p>
                <p>
                  <span className="font-medium">Número:</span> {address.number}
                </p>
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
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
