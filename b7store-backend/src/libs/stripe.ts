import Stripe from 'stripe'
import { env } from '../env'
import { getProduct } from '../services/product'
import { CartItem } from '../types/cart-item'

export const stripe = new Stripe(env.STRIPE_SECRET_KEY)

type StripeCheckoutSessionParams = {
  cart: CartItem[]
  shippingCost: number
  orderId: number
}

export const createStripeCheckoutSession = async ({
  cart,
  shippingCost,
  orderId,
}: StripeCheckoutSessionParams) => {
  const stripeLineItems = []

  for (const item of cart) {
    const product = await getProduct(item.productId)
    if (product) {
      stripeLineItems.push({
        price_data: {
          product_data: {
            name: product.label,
          },
          currency: 'BRL',
          unit_amount: Math.round(product.price * 100),
        },
        quantity: item.quantity,
      })
    }
  }

  if (shippingCost > 0) {
    stripeLineItems.push({
      price_data: {
        product_data: {
          name: 'Frete',
        },
        currency: 'BRL',
        unit_amount: Math.round(shippingCost * 100),
      },
      quantity: 1,
    })
  }

  const session = await stripe.checkout.sessions.create({
    line_items: stripeLineItems,
    mode: 'payment',
    metadata: { orderId: orderId.toString() },
    success_url: `${env.FRONTEND_URL}/cart/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${env.FRONTEND_URL}/my-orders`,
  })

  return session
}

export const getConstructEvent = async (
  rawBody: Buffer,
  sig: string,
  webhookKey: string,
) => {
  try {
    return stripe.webhooks.constructEvent(rawBody, sig, webhookKey)
  } catch {
    return null
  }
}

export const getStripeCheckoutSession = async (sessionId: string) => {
  return await stripe.checkout.sessions.retrieve(sessionId)
}
