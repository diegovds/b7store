import { prisma } from '../libs/prisma'
import { Address } from '../types/address'
import { CartItem } from '../types/cart-item'
import { getProduct } from './product'

interface CreateOrderParams {
  userId: number
  address: Address
  shippingCost: number
  shippingDays: number
  cart: CartItem[]
}

export const createOrder = async ({
  userId,
  address,
  shippingCost,
  shippingDays,
  cart,
}: CreateOrderParams) => {
  let subtotal = 0
  const orderItems = []

  for (const cartItem of cart) {
    const product = await getProduct(cartItem.productId)
    if (product) {
      subtotal += product.price * cartItem.quantity

      orderItems.push({
        productId: product.id,
        quantity: cartItem.quantity,
        price: product.price,
      })
    }
  }

  const total = subtotal + shippingCost

  const order = await prisma.order.create({
    data: {
      userId,
      total,
      shippingCost,
      shippingDays,
      shippingZipcode: address.zipcode,
      shippingStreet: address.street,
      shippingNumber: address.number,
      shippingCity: address.city,
      shippingState: address.state,
      shippingCountry: address.country,
      shippingComplement: address.complement,
      orderItems: { create: orderItems },
    },
    select: { id: true },
  })

  if (!order) return null
  return order.id
}
