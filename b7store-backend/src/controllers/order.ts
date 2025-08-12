import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { getUserOrders } from '../services/order'
import { getOrderIdFromSession } from '../services/payment'

const orderSchema = z.object({
  id: z.number().int().positive(),
  status: z.string(),
  total: z.number().positive(),
  createdAt: z.instanceof(Date),
})

export const ordersResponseSchema = z.object({
  error: z.string().nullable(),
  orders: z.array(orderSchema),
})

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

export const listOrders: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/orders',
    {
      schema: {
        summary: 'List all orders for the logged-in user.',
        tags: ['order'],
        security: [{ bearerAuth: [] }],
        response: {
          200: ordersResponseSchema,
        },
      },
      preHandler: [app.authenticate],
    },
    async (request, reply) => {
      const userId = parseInt(request.user.sub)

      const orders = await getUserOrders(userId)

      return reply.status(200).send({ error: null, orders })
    },
  )
}
