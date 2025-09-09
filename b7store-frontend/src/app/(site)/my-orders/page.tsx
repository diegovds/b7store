import { getAuthState } from '@/actions/get-auth-state'
import { MyOrdersContainer } from '@/components/my-orders/my-orders-container'
import {
  getOrders,
  getOrdersId,
  GetOrdersId200Order,
  getUserAddresses,
} from '@/http/api'
import { redirect } from 'next/navigation'

export default async function MyOrdersPage() {
  const { token } = await getAuthState()

  if (!token) return redirect('/login')

  const { error, orders } = await getOrders({
    headers: { Authorization: `Bearer ${token}` },
  })

  if (error) return redirect('/')

  const myOrders: GetOrdersId200Order[] = []

  for (const ooder of orders) {
    const { error, order } = await getOrdersId(ooder.id.toString(), {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!error && order) {
      myOrders.push(order)
    }
  }

  const { error: errorAddresses, address } = await getUserAddresses({
    headers: { Authorization: `Bearer ${token}` },
  })

  if (errorAddresses) return redirect('/')

  return <MyOrdersContainer myOrders={myOrders} addresses={address} />
}
