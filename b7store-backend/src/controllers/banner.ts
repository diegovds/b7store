import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { getAllBanners } from '../services/banner'
import { getAbsoluteImageUrl } from '../utils/get-absolute-image-url'

const bannerResponseSchema = z.array(
  z.object({
    img: z.url(),
    link: z.string(),
  }),
)

const response = z.object({
  error: z.string().nullable(),
  banners: bannerResponseSchema,
})

export const getBanners: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/banners',
    {
      schema: {
        summary: 'Get all banners.',
        tags: ['banners'],
        security: [],
        response: {
          200: response,
        },
      },
    },
    async (request, reply) => {
      const banners = await getAllBanners()
      const bannersWithAbsoluteUrl = banners.map((banner) => ({
        ...banner,
        img: getAbsoluteImageUrl(banner.img),
      }))

      return reply
        .status(200)
        .send({ error: null, banners: bannersWithAbsoluteUrl })
    },
  )
}
