'use client'

import { clearAuthCookie } from '@/actions/clear-auth-cookie'
import { GetOrdersId200Order, GetUserAddresses200AddressItem } from '@/http/api'
import { useAuthStore } from '@/store/auth'
import { LogOut } from 'lucide-react'
import { redirect } from 'next/navigation'
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
  const { clearToken } = useAuthStore()

  return (
    <div>
      <div className="flex flex-col">
        <div className="flex items-center justify-between gap-2 py-4">
          <div className="flex gap-2">
            <button
              disabled={viewOrders}
              onClick={() => setViewOrders(true)}
              className={`cursor-pointer border-0 border-b pb-1 text-black duration-300 disabled:cursor-default ${viewOrders ? 'border-gray-300 font-medium opacity-65' : 'border-transparent font-normal'}`}
            >
              Meus Pedidos
            </button>
            <button
              disabled={!viewOrders}
              onClick={() => setViewOrders(false)}
              className={`cursor-pointer border-0 border-b pb-1 text-black duration-300 disabled:cursor-default ${!viewOrders ? 'border-gray-300 font-medium opacity-65' : 'border-transparent font-normal'}`}
            >
              Meus Endereços
            </button>
          </div>
          <button
            className="cursor-pointer"
            onClick={async () => {
              await clearAuthCookie()
              clearToken()
              redirect('/')
            }}
          >
            <LogOut />
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
