import { MyOrdersContainer } from '@/components/my-orders/my-orders-container'
import {
    getOrders,
    getOrdersId,
    GetOrdersId200Order,
    getUserAddresses,
} from '@/http/api'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function MyOrdersPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')

  if (!token) return redirect('/')

  const { error, orders } = await getOrders({
    headers: { Authorization: `Bearer ${token.value}` },
  })

  if (error) return redirect('/')

  const myOrders: GetOrdersId200Order[] = []

  for (const ooder of orders) {
    const { error, order } = await getOrdersId(ooder.id.toString(), {
      headers: { Authorization: `Bearer ${token.value}` },
    })

    if (!error && order) {
      myOrders.push(order)
    }
  }

  const { error: errorAddresses, address } = await getUserAddresses({
    headers: { Authorization: `Bearer ${token.value}` },
  })

  if (errorAddresses) return redirect('/')

  return <MyOrdersContainer myOrders={myOrders} addresses={address} />
}
