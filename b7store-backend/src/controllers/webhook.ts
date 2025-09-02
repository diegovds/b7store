import { FastifyInstance } from 'fastify'
import rawBody from 'fastify-raw-body'
import Stripe from 'stripe'
import { env } from '../env'
import { updateOrderStatus } from '../services/order'

const stripe = new Stripe(env.STRIPE_SECRET_KEY)

export async function registerStripeWebhook(app: FastifyInstance) {
  await app.register(rawBody, {
    field: 'rawBody',
    global: false,
    encoding: false,
    runFirst: true,
  })

  app.route({
    method: 'POST',
    url: '/webhook/stripe',
    config: {
      rawBody: true,
    },
    handler: async (request, reply) => {
      const sig = request.headers['stripe-signature'] as string
      const rawBody = request.rawBody as Buffer
      const webhookSecret = env.STRIPE_WEBHOOK_SECRET

      let event: Stripe.Event
      try {
        event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret)
      } catch (err) {
        console.error('Invalid signature:', err)
        return reply.status(400).send({ error: 'Invalid signature' })
      }

      const session = event.data.object as any
      const orderId = parseInt(session.metadata?.orderId)

      switch (event.type) {
        case 'checkout.session.completed':
        case 'checkout.session.async_payment_succeeded':
          await updateOrderStatus(orderId, 'paid')
          break
        case 'checkout.session.expired':
        case 'checkout.session.async_payment_failed':
          await updateOrderStatus(orderId, 'cancelled')
          break
      }

      return reply.status(200).send({ received: true })
    },
  })
}
