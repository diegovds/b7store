import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { createOrder } from '../services/order'
import { getProduct } from '../services/product'
import { getAddressById } from '../services/user'
import { getAbsoluteImageUrl } from '../utils/get-absolute-image-url'

const cartMountSchema = z.object({
  ids: z.array(z.number().int()).nonempty(),
})

const productsSchema = z.array(
  z.object({
    id: z.number(),
    label: z.string(),
    price: z.number(),
    image: z.string().nullable(),
  }),
)

export const cartItemSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().positive().min(1),
})

export const orderSchema = z.object({
  cart: z.array(cartItemSchema).nonempty('O carrinho não pode estar vazio'),
  addressId: z.number().int().positive(),
})

export const cartMount: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/cart/mount',
    {
      schema: {
        summary: 'Get product details for a list of product IDs.',
        tags: ['cart'],
        security: [],
        body: cartMountSchema,
        response: {
          200: z.object({
            error: z.string().nullable(),
            products: productsSchema,
          }),
        },
      },
    },
    async (request, reply) => {
      const { ids } = request.body

      const products = []
      for (const id of ids) {
        const product = await getProduct(id)
        if (product) {
          products.push({
            id: product.id,
            label: product.label,
            price: product.price,
            image: product.images[0]
              ? getAbsoluteImageUrl(product.images[0])
              : null,
          })
        }
      }

      return reply.status(200).send({ error: null, products })
    },
  )
}

export const calculateShipping: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/cart/shipping',
    {
      schema: {
        summary: 'Calculate shipping cost and days for a zipcode.',
        tags: ['cart'],
        security: [],
        querystring: z.object({
          zipcode: z
            .string()
            .regex(/^\d{5}-\d{3}$/, 'O CEP deve estar no formato 12345-678'),
        }),
        response: {
          200: z.object({
            error: z.string().nullable(),
            zipcode: z.string(),
            cost: z.number(),
            days: z.number(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { zipcode } = request.query

      return reply.status(200).send({ error: null, zipcode, cost: 7, days: 3 })
    },
  )
}

export const finish: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/cart/finish',
    {
      schema: {
        summary:
          'Finish the cart and create an order (returns Stripe checkout URL).',
        tags: ['cart'],
        security: [{ bearerAuth: [] }],
        body: orderSchema,
        response: {
          200: z.object({
            error: z.string().nullable(),
            url: z.number(),
          }),
          400: z.object({ error: z.string() }),
        },
      },
      preHandler: [app.authenticate],
    },
    async (request, reply) => {
      const { addressId, cart } = request.body
      const userId = parseInt(request.user.sub)

      const address = await getAddressById(userId, addressId)

      if (!address) {
        return reply.status(400).send({ error: 'Endereço não encontrado' })
      }

      const shippingCost = 7 // TODO: temporário
      const shippingDays = 3 // TODO: temporário

      const orderId = await createOrder({
        userId,
        address,
        shippingCost,
        shippingDays,
        cart,
      })

      if (!orderId) {
        return reply.status(400).send({ error: 'Pedido não criado.' })
      }

      return reply.status(200).send({ error: null, url: orderId })
    },
  )
}
