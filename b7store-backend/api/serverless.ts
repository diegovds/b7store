import { fastifyCors } from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import fastifyStatic from '@fastify/static'
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
import path from 'path'
import { env } from '../src/env'
import { routes } from '../src/routes/main'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

const publicFolder = path.join(__dirname, '..', 'public')

app.register(fastifyStatic, {
  root: publicFolder,
  prefix: '/',
})

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
  if (error.validation) {
    return reply.status(400).send({
      error: error.message,
    })
  }
  reply.status(500).send({ error: 'Internal Server Error' })
})

app.listen({ port: env.PORT }).then(() => {
  console.log(`🚀 HTTP Server Running! http://localhost:${env.PORT}`)
})
