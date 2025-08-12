import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { getOrderById, getUserOrders } from '../services/order'
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

const productSchema = z.object({
  id: z.number().int().positive(),
  label: z.string(),
  price: z.number().positive(),
  image: z.string().nullable(),
})

const orderItemSchema = z.object({
  id: z.number().int().positive(),
  quantity: z.number().int().positive(),
  price: z.number().positive(),
  product: productSchema,
})

const fullOrderSchema = orderSchema.extend({
  shippingCost: z.number().nonnegative(),
  shippingDays: z.number().int().nonnegative(),
  shippingZipcode: z.string().nullable(),
  shippingStreet: z.string().nullable(),
  shippingNumber: z.string().nullable(),
  shippingCity: z.string().nullable(),
  shippingState: z.string().nullable(),
  shippingCountry: z.string().nullable(),
  shippingComplement: z.string().nullable(),
  orderItems: z.array(orderItemSchema).nonempty(),
})

export const orderResponseSchema = z.object({
  error: z.string().nullable(),
  order: fullOrderSchema,
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

export const getOrder: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/orders/:id',
    {
      schema: {
        summary:
          'Get details of a specific order by ID for the logged-in user.',
        tags: ['order'],
        security: [{ bearerAuth: [] }],
        params: z.object({
          id: z.string().regex(/^\d+$/),
        }),
        response: {
          200: orderResponseSchema,
          404: z.object({
            error: z.string(),
          }),
        },
      },
      preHandler: [app.authenticate],
    },
    async (request, reply) => {
      const id = parseInt(request.params.id)
      const userId = parseInt(request.user.sub)

      const order = await getOrderById(id, userId)

      if (!order) {
        return reply.status(404).send({ error: 'Order not found' })
      }

      return reply.status(200).send({ error: null, order })
    },
  )
}
