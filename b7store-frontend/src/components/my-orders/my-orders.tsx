'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Card } from '@/components/ui/card'
import { GetOrdersId200Order } from '@/http/api'
import Image from 'next/image'

type MyOrdersProps = {
  myOrders: GetOrdersId200Order[]
}

export const MyOrders = ({ myOrders }: MyOrdersProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-medium">
        Você possui {myOrders.length}{' '}
        {myOrders.length !== 1 ? 'pedidos' : 'pedido'}:
      </h2>

      <Accordion
        type="single"
        collapsible
        className="space-y-3"
        defaultValue={myOrders.length.toString()}
      >
        {myOrders.map((order) => (
          <AccordionItem
            key={order.id}
            value={order.id.toString()}
            className="rounded border border-gray-200 px-4"
          >
            <AccordionTrigger className="py-4 font-medium hover:no-underline">
              <span
                className={
                  order.status === 'paid'
                    ? 'font-semibold text-green-600'
                    : order.status === 'pending'
                      ? 'font-semibold text-yellow-600'
                      : 'font-semibold text-red-600'
                }
              >
                {order.status === 'paid'
                  ? '✅ Aprovado'
                  : order.status === 'pending'
                    ? '⏳ Pendente'
                    : '❌ Cancelado'}
              </span>{' '}
              · Pedido #{order.id}
            </AccordionTrigger>

            <AccordionContent>
              <Card className="space-y-4 rounded p-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total:</span>
                  <span className="font-semibold">
                    R${order.total.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Entrega em até:</span>
                  <span className="font-semibold">
                    {order.shippingDays} dias
                  </span>
                </div>

                <div className="text-sm">
                  <span className="block font-semibold">Endereço:</span>
                  <span className="text-muted-foreground">
                    {order.shippingStreet}, {order.shippingNumber} -{' '}
                    {order.shippingCity} ({order.shippingZipcode})
                  </span>
                </div>

                <div>
                  <h3 className="mb-2 text-sm font-semibold">
                    {order.orderItems.length > 1
                      ? 'Itens do pedido'
                      : 'Item do pedido'}
                  </h3>
                  <ul className="divide-muted bg-muted/50 divide-y rounded shadow">
                    {order.orderItems.map((item) => (
                      <li
                        key={item.id}
                        className="flex items-center justify-between gap-4 px-4 py-3 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          {item.product.image && (
                            <div className="flex aspect-square items-center justify-center rounded bg-white p-2">
                              <Image
                                src={item.product.image}
                                alt={item.product.label}
                                width={50}
                                height={50}
                              />
                            </div>
                          )}
                          <span className="text-sm font-medium">
                            {item.product.label}
                          </span>
                        </div>
                        <span className="text-sm font-semibold">
                          R${item.price.toFixed(2)} × {item.quantity}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
