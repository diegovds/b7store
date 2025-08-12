import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { getProduct } from '../services/product'
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
            .min(5, 'Zipcode must be at least 5 characters long'),
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
