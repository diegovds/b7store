import { getOrdersId, getOrdersSession } from '@/http/api'
import { cookies } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface CartSuccessPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function PurchaseCompletedPage({
  searchParams,
}: CartSuccessPageProps) {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')
  const sessionId = (await searchParams).session_id

  if (typeof sessionId !== 'string' || !token) return notFound()

  const { error, orderId: id } = await getOrdersSession({
    session_id: sessionId,
  })

  if (error) return notFound()

  const order = await getOrdersId(id.toString(), {
    headers: { Authorization: `Bearer ${token.value}` },
  })

  if (order.error) return notFound()

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6 rounded border border-gray-200 bg-white p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">
            {order.order.status === 'paid'
              ? '🎉 Parabéns, sua compra foi concluída!'
              : order.order.status === 'pending'
                ? '⏳ Compra pendente'
                : '❌ Compra cancelada'}
          </h1>
          <p className="mt-2 text-gray-600">
            Obrigado por comprar conosco. Aqui estão os detalhes do seu pedido.
          </p>
        </div>

        <div className="flex flex-col gap-4 border-t border-b border-gray-200 py-4">
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">
              Código do pedido:
            </span>
            <span className="text-gray-900">{order.order.id}</span>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-gray-700">
              Endereço de entrega:
            </span>
            <span className="text-gray-900">
              {`${order.order.shippingStreet}, ${order.order.shippingNumber} - ${order.order.shippingCity} (${order.order.shippingZipcode})`}
            </span>
          </div>
          <div className="flex justify-between">
            <div>
              Entrega em até{' '}
              <span className="font-medium">
                {order.order.shippingDays} dias
              </span>
            </div>
            <div>
              Valor do frete{' '}
              <span className="font-medium">
                R${order.order.shippingCost.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div>
          <h2 className="mb-2 text-lg font-semibold text-gray-800">
            {order.order.orderItems.length > 1
              ? 'Itens do pedido'
              : 'Item do pedido'}
          </h2>
          <ul className="divide-y divide-gray-200 rounded border border-gray-100 bg-gray-50">
            {order.order.orderItems.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between gap-4 px-4 py-3 text-gray-700"
              >
                <div className="flex items-center gap-3">
                  {item.product.image && (
                    <div className="rounded border border-gray-200 bg-white p-2">
                      <Image
                        src={item.product.image}
                        alt={item.product.label}
                        width={50}
                        height={50}
                        className="object-cover"
                      />
                    </div>
                  )}
                  <span>{item.product.label}</span>
                </div>
                <span className="font-medium">
                  R${item.price.toFixed(2)} x {item.quantity}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex justify-between border-t border-gray-200 pt-4 text-lg font-semibold text-gray-900">
          <span>Total:</span>
          <span>R${order.order.total.toFixed(2)}</span>
        </div>

        <div className="flex justify-between border-t border-gray-200 pt-4 text-lg font-semibold text-gray-900">
          <span>Pagamento:</span>
          <span>
            {order.order.status === 'paid'
              ? 'Aprovado'
              : order.order.status === 'cancelled'
                ? 'Cancelado'
                : 'Pendente'}
          </span>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-block rounded bg-blue-600 px-6 py-2 text-white transition hover:bg-blue-700"
          >
            Voltar à loja
          </Link>
        </div>
      </div>
    </div>
  )
}
