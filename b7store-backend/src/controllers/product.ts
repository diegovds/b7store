import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import {
  getProduct,
  getProducts,
  getProductsFromSameCategory,
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

const productsResponseSchema = z.object({
  error: z.string().nullable(),
  products: productResponseSchema,
})

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
    liked: z.boolean(),
  })
  .nullable()

export const getProductResponseSchema = z.object({
  error: z.string().nullable(),
  product: productSchema,
  category: categorySchema,
})

export const getAllProducts: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/products',
    {
      schema: {
        summary: 'Get all products.',
        tags: ['products'],
        security: [],
        querystring: productBodySchema,
        response: {
          200: productsResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { limit, metadata, orderBy } = request.query

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
        liked: false,
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

export const getRelatedProduct: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/product/:id/related',
    {
      schema: {
        summary: 'Get related products from the same category.',
        tags: ['products'],
        security: [],
        params: z.object({
          id: z.string().regex(/^\d+$/),
        }),
        querystring: z.object({
          limit: z.string().regex(/^\d+$/).optional(),
        }),
        response: {
          200: productsResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const id = parseInt(request.params.id)
      const limit = request.query.limit
        ? parseInt(request.query.limit)
        : undefined

      if (Number.isNaN(id) || (limit && Number.isNaN(limit))) {
        return reply.status(400).send({ error: 'Invalid id', products: [] })
      }

      const products = await getProductsFromSameCategory(id, limit || undefined)

      if (!products) {
        return reply
          .status(404)
          .send({ error: 'Product not found', products: [] })
      }

      const productsWithAbsoluteUrl = products.map((product) => ({
        ...product,
        image: product.image ? getAbsoluteImageUrl(product.image) : null,
        liked: false,
      }))

      return reply.status(200).send({
        error: null,
        products: productsWithAbsoluteUrl,
      })
    },
  )
}
