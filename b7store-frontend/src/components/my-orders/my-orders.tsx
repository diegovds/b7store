'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { GetOrdersId200Order } from '@/http/api'
import Image from 'next/image'

type MyOrdersProps = {
  myOrders: GetOrdersId200Order[]
}

export const MyOrders = ({ myOrders }: MyOrdersProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">
        Você possui {myOrders.length}{' '}
        {myOrders.length !== 1 ? 'pedidos' : 'pedido'}:
      </h2>

      <Accordion
        type="single"
        collapsible
        className="border border-gray-200 bg-white p-7"
        defaultValue={myOrders.length.toString()}
      >
        {myOrders.map((order) => (
          <AccordionItem key={order.id} value={order.id.toString()}>
            <AccordionTrigger className="hover:no-underline">
              Pedido #{order.id} -{' '}
              {order.status === 'paid'
                ? 'Aprovado'
                : order.status === 'pending'
                  ? 'Pendente'
                  : 'Cancelado'}
            </AccordionTrigger>

            <AccordionContent>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                  <span>Total:</span>
                  <span>R${order.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Entrega em até:</span>
                  <span>{order.shippingDays} dias</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold">Endereço:</span>
                  <span>
                    {order.shippingStreet}, {order.shippingNumber} -{' '}
                    {order.shippingCity} ({order.shippingZipcode})
                  </span>
                </div>

                <div className="mt-2">
                  <h3 className="mb-1 font-semibold">
                    {order.orderItems.length > 1
                      ? 'Itens do pedido'
                      : 'Item do pedido'}
                  </h3>
                  <ul className="divide-y divide-gray-200 rounded border border-gray-100 bg-gray-50">
                    {order.orderItems.map((item) => (
                      <li
                        key={item.id}
                        className="flex items-center justify-between px-4 py-2 text-gray-700"
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
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
