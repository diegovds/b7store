import { fastifyCors } from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import { fastifySwagger } from '@fastify/swagger'
import { fastifySwaggerUi } from '@fastify/swagger-ui'
import fastify from 'fastify'
import fastifyBcrypt from 'fastify-bcrypt'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { env } from './env'
import { routes } from './routes/main'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.register(fastifyCors, {
  origin: true,
})

app.register(fastifyBcrypt, {
  saltWorkFactor: 10,
})

app.register(fastifyJwt, {
  secret: env.JWT_SECRET_KEY,
})

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'B7Store Backend',
      version: '0.0.1',
      description: 'API para a B7Store',
    },
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})

app.register(routes)

app.setErrorHandler((error, request, reply) => {
  console.error(error)

  reply.status(500).send({
    error: 'Ocorreu algum erro',
  })
})

app.listen({ port: env.PORT }).then(() => {
  console.log(`🚀 HTTP Server Running! http://localhost:${env.PORT}`)
})
