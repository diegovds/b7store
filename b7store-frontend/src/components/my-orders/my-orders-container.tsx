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
            onClick={() => setViewOrders(true)}
            className="cursor-pointer bg-blue-200"
          >
            Meus Pedidos
          </button>
          <button
            onClick={() => setViewOrders(false)}
            className="cursor-pointer bg-blue-200"
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
