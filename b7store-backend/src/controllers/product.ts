import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { getAllProducts } from '../services/product'
import { getAbsoluteImageUrl } from '../utils/get-absolute-image-url'

const productBodySchema = z.object({
  metadata: z.string().optional(),
  orderBy: z.enum(['views', 'selling', 'price']).optional(),
  limit: z.string().regex(/^\d+$/).optional(),
})

const productResponseSchema = z.array(
  z.object({
    id: z.number().int().positive(),
    label: z.string(),
    price: z.number(),
    image: z.url().nullable(),
    liked: z.boolean(),
  }),
)

const response = z.object({
  error: z.string().nullable(),
  products: productResponseSchema,
})

export const getProducts: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/products',
    {
      schema: {
        summary: 'Get all products.',
        tags: ['products'],
        security: [],
        body: productBodySchema,
        response: {
          200: response,
        },
      },
    },
    async (request, reply) => {
      const { limit, metadata, orderBy } = request.body

      const parsedLimit = limit ? parseInt(limit) : undefined
      const parsedMetadata = metadata ? JSON.parse(metadata) : undefined

      const products = await getAllProducts({
        limit: parsedLimit,
        metadata: parsedMetadata,
        order: orderBy,
      })

      const productsWithAbsoluteUrl = products.map((product) => ({
        ...product,
        image: product.image ? getAbsoluteImageUrl(product.image) : null,
        liked: false,
      }))

      return reply
        .status(200)
        .send({ error: null, products: productsWithAbsoluteUrl })
    },
  )
}
