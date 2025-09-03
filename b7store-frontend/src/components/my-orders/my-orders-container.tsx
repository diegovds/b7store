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
            className={`cursor-pointer rounded-sm border-0 px-4 py-2 text-white duration-300 hover:bg-blue-700 disabled:cursor-default ${viewOrders ? 'bg-black disabled:hover:bg-black' : 'bg-blue-600 disabled:hover:bg-blue-600'}`}
          >
            Meus Pedidos
          </button>
          <button
            disabled={!viewOrders}
            onClick={() => setViewOrders(false)}
            className={`cursor-pointer rounded-sm border-0 px-4 py-2 text-white duration-300 hover:bg-blue-700 disabled:cursor-default ${!viewOrders ? 'bg-black disabled:hover:bg-black' : 'bg-blue-600 disabled:hover:bg-blue-600'}`}
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
