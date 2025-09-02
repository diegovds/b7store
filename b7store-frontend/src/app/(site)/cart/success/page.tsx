import { getOrdersId, getOrdersSession } from '@/http/api'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'

interface CartSuccessPageProps {
  searchParams: { session_id?: string }
}

export default async function PurchaseCompletedPage({
  searchParams,
}: CartSuccessPageProps) {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')
  const sessionId = searchParams.session_id

  if (!sessionId || !token) return notFound()

  const { error, orderId: id } = await getOrdersSession({
    session_id: sessionId,
  })

  if (error) return notFound()

  const order = await getOrdersId(id.toString(), {
    headers: { Authorization: `Bearer ${token.value}` },
  })

  if (order.error) return notFound()

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="m-4 flex w-full max-w-xl flex-col items-center space-y-4 rounded border border-gray-200 bg-white p-6">
        <h2 className="text-xl font-medium">
          {order.order.status === 'paid'
            ? 'Parabéns, sua compra foi concluída'
            : order.order.status === 'pending'
              ? 'Compra pendente'
              : 'Compra cancelada'}
        </h2>
        <div className="flex w-full justify-between">
          <h3>
            Código do pedido:{' '}
            <span className="font-medium">{order.order.id}</span>
          </h3>
        </div>
        <div className="w-full">
          <p className="line-clamp-1">
            Endereço de entrega:{' '}
            <span className="font-medium">{`${order.order.shippingStreet}, ${order.order.shippingNumber} - ${order.order.shippingCity} (${order.order.shippingZipcode})`}</span>
          </p>
        </div>
        <div className="flex w-full justify-between">
          <div>
            Entrega em até{' '}
            <span className="font-medium">{order.order.shippingDays} dias</span>
          </div>
          <div>
            Valor do frete{' '}
            <span className="font-medium">
              R${order.order.shippingCost.toFixed(2)}
            </span>
          </div>
        </div>
        <div className="w-full">
          {order.order.orderItems.length !== 1 ? 'Itens:' : 'Item:'}
          {order.order.orderItems.map((item) => (
            <div key={item.id}>{item.product.label}</div>
          ))}
        </div>
      </div>
    </div>
  )
}
