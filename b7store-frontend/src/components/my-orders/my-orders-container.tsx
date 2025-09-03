'use client'

import { GetOrdersId200Order, GetUserAddresses200AddressItem } from '@/http/api'
import { useState } from 'react'
import { MyAddresses } from './my-addresses'
import { MyOrders } from './my-orders'

type MyOrdersContainerProsp = {
  myOrders: GetOrdersId200Order[]
  addresses: GetUserAddresses200AddressItem[]
}

export const MyOrdersContainer = ({
  addresses,
  myOrders,
}: MyOrdersContainerProsp) => {
  const [viewOrders, setViewOrders] = useState(true)

  return (
    <div className="min-h-screen">
      <div className="flex flex-col">
        <div className="flex gap-2 py-4">
          <button
            disabled={viewOrders}
            onClick={() => setViewOrders(true)}
            className={`cursor-pointer border-0 border-b pb-1 text-black duration-300 disabled:cursor-default ${viewOrders ? 'border-gray-300 opacity-65' : 'border-transparent'}`}
          >
            Meus Pedidos
          </button>
          <button
            disabled={!viewOrders}
            onClick={() => setViewOrders(false)}
            className={`cursor-pointer border-0 border-b pb-1 text-black duration-300 disabled:cursor-default ${!viewOrders ? 'border-gray-300 opacity-65' : 'border-transparent'}`}
          >
            Meus Endereços
          </button>
        </div>
        <div>
          {viewOrders ? (
            <MyOrders myOrders={myOrders} />
          ) : (
            <MyAddresses addresses={addresses} />
          )}
        </div>
      </div>
    </div>
  )
}
