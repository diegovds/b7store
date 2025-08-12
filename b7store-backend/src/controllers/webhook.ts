import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { env } from '../env'
import { getConstructEvent } from '../libs/stripe'
import { updateOrderStatus } from '../services/order'

export const stripe: FastifyPluginAsyncZod = async (app) => {
  // Parser customizado apenas para application/json
  app.addContentTypeParser(
    'application/json',
    { parseAs: 'buffer' },
    function (_req, body, done) {
      done(null, body.toString())
    },
  )

  app.post(
    '/webhook/stripe',
    {
      schema: {
        summary: 'Handle Stripe payment events and update order statuses.',
        tags: ['stripe'],
        security: [],
        body: z.string(),
        headers: z.object({
          'stripe-signature': z.string(),
        }),
        response: {
          200: z.object({
            error: z.string().nullable(),
          }),
        },
      },
    },
    async (request, reply) => {
      const sig = request.headers['stripe-signature']
      const webhookKey = env.STRIPE_WEBHOOK_SECRET
      const rawBody = request.body

      try {
        const event = await getConstructEvent(rawBody, sig, webhookKey)

        if (event) {
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
        }

        return reply.status(200).send({ error: null })
      } catch (err) {
        console.error('Stripe webhook error:', err)
        return reply.status(400).send({ error: 'Invalid signature' })
      }
    },
  )
}
