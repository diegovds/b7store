import { FastifyInstance } from 'fastify'
import { getBanners } from '../controllers/banner'
import { calculateShipping, cartMount, finish } from '../controllers/cart'
import { getCategoryWithMetadata } from '../controllers/category'
import { getOrder, getOrderBySessionId, listOrders } from '../controllers/order'
import {
  getAllProducts,
  getOneProduct,
  getRelatedProduct,
} from '../controllers/product'
import { addAddress, getAddresses, login, register } from '../controllers/user'

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
  app.register(login)
  app.register(addAddress)
  app.register(getAddresses)
  app.register(finish)
  app.register(getOrderBySessionId)
  app.register(listOrders)
  app.register(getOrder)
}
