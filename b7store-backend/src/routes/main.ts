import { FastifyInstance } from 'fastify'
import { getBanners } from '../controllers/banner'
import { getProducts } from '../controllers/product'

export async function routes(app: FastifyInstance) {
  app.get('/ping', async (request, reply) => {
    reply.send({ pong: true })
  })

  app.register(getBanners)
  app.register(getProducts)
}
