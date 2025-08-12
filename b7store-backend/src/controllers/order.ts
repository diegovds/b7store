import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { getOrderIdFromSession } from '../services/payment'

export const getOrderBySessionId: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/orders/session',
    {
      schema: {
        summary: 'Get order ID by Stripe session ID.',
        tags: ['order'],
        security: [],
        querystring: z.object({
          session_id: z.string(),
        }),
        response: {
          200: z.object({
            error: z.string().nullable(),
            orderId: z.number(),
          }),
          404: z.object({
            error: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { session_id } = request.query

      const orderId = await getOrderIdFromSession(session_id)

      if (!orderId) {
        return reply.status(404).send({ error: 'Order not found' })
      }

      return reply.status(200).send({ error: null, orderId })
    },
  )
}
