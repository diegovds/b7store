import { FastifyInstance } from 'fastify'
import { getBanners } from '../controllers/banner'
import { calculateShipping, cartMount } from '../controllers/cart'
import { getCategoryWithMetadata } from '../controllers/category'
import {
  getAllProducts,
  getOneProduct,
  getRelatedProduct,
} from '../controllers/product'
import { register } from '../controllers/user'

export async function routes(app: FastifyInstance) {
  app.get('/ping', async (request, reply) => {
    reply.send({ pong: true })
  })

  app.register(getBanners)
  app.register(getAllProducts)
  app.register(getOneProduct)
  app.register(getRelatedProduct)
  app.register(getCategoryWithMetadata)
  app.register(cartMount)
  app.register(calculateShipping)
  app.register(register)
}
