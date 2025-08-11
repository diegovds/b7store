import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import {
  getProduct,
  getProducts,
  incrementProductView,
} from '../services/product'
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

export const getAllProducts: FastifyPluginAsyncZod = async (app) => {
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

      const products = await getProducts({
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

const categorySchema = z
  .object({
    id: z.number(),
    name: z.string(),
    slug: z.string(),
  })
  .nullable()

const productSchema = z
  .object({
    id: z.number().int().positive(),
    label: z.string(),
    price: z.number(),
    description: z.string().nullable(),
    images: z.array(z.url()),
  })
  .nullable()

export const getProductResponseSchema = z.object({
  error: z.string().nullable(),
  product: productSchema,
  category: categorySchema,
})

export const getOneProduct: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/product/:id',
    {
      schema: {
        summary: 'Get product by ID.',
        tags: ['products'],
        security: [],
        params: z.object({
          id: z.string().regex(/^\d+$/),
        }),
        response: {
          200: getProductResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const id = parseInt(request.params.id)

      if (Number.isNaN(id)) {
        return reply
          .status(400)
          .send({ error: 'Invalid id', product: null, category: null })
      }

      const product = await getProduct(id)

      if (!product) {
        return reply
          .status(404)
          .send({ error: 'Product not found', product: null, category: null })
      }

      const productWithAbsoluteImages = {
        ...product,
        images: product.images.map((img) => getAbsoluteImageUrl(img)),
      }

      await incrementProductView(product.id)

      return reply.status(200).send({
        error: null,
        product: productWithAbsoluteImages,
        category: product.category,
      })
    },
  )
}
