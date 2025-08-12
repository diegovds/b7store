import { FastifyInstance } from 'fastify'
import { getBanners } from '../controllers/banner'
import { getCategoryWithMetadata } from '../controllers/category'
import {
  getAllProducts,
  getOneProduct,
  getRelatedProduct,
} from '../controllers/product'

export async function routes(app: FastifyInstance) {
  app.get('/ping', async (request, reply) => {
    reply.send({ pong: true })
  })

  app.register(getBanners)
  app.register(getAllProducts)
  app.register(getOneProduct)
  app.register(getRelatedProduct)
  app.register(getCategoryWithMetadata)
}
