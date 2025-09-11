import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import {
  getCategoryById,
  getCategoryBySlug,
  getCategoryMetadata,
  getCategorySearchMetadata,
} from '../services/category'

const categorySchema = z
  .object({
    id: z.number(),
    name: z.string(),
    slug: z.string(),
  })
  .nullable()

const metadataSchema = z.array(
  z.object({
    id: z.string(),
    name: z.string(),
    values: z.array(
      z.object({
        id: z.string(),
        label: z.string(),
      }),
    ),
  }),
)

const categoryResponseSchema = z.object({
  error: z.string().nullable(),
  category: categorySchema,
  metadata: metadataSchema,
})

export const getCategoryWithMetadata: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/category/:slug/metadata',
    {
      schema: {
        summary: 'Get category and its metadata by slug.',
        tags: ['categories'],
        security: [],
        params: z.object({
          slug: z.string(),
        }),
        response: {
          200: categoryResponseSchema,
          404: z.object({
            error: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { slug } = request.params

      const category = await getCategoryBySlug(slug)
      if (!category) {
        return reply.status(404).send({ error: 'Category not found' })
      }

      const metadata = await getCategoryMetadata(category.id)

      return reply.status(200).send({
        error: null,
        category,
        metadata,
      })
    },
  )
}

export const getCategorySearchWithMetadata: FastifyPluginAsyncZod = async (
  app,
) => {
  app.get(
    '/category/search/:q/metadata',
    {
      schema: {
        summary: 'Get metadata based on search.',
        tags: ['categories'],
        security: [],
        params: z.object({
          q: z.string(),
        }),
        response: {
          200: z.object({
            error: z.string().nullable(),
            metadata: z.array(
              z.object({
                id: z.string(),
                name: z.string(),
                values: z.array(
                  z.object({
                    id: z.string(),
                    label: z.string(),
                  }),
                ),
              }),
            ),
          }),
        },
      },
    },
    async (request, reply) => {
      const { q } = request.params

      const metadata = await getCategorySearchMetadata(q)

      return reply.status(200).send({
        error: null,
        metadata,
      })
    },
  )
}

export const getCategoryWithID: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/category/:id',
    {
      schema: {
        summary: 'Get category and its metadata by id.',
        tags: ['categories'],
        security: [],
        params: z.object({
          id: z.string(),
        }),
        response: {
          200: categoryResponseSchema,
          404: z.object({
            error: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params

      const category = await getCategoryById(parseInt(id))
      if (!category) {
        return reply.status(404).send({ error: 'Category not found' })
      }

      const metadata = await getCategoryMetadata(category.id)

      return reply.status(200).send({
        error: null,
        category,
        metadata,
      })
    },
  )
}
