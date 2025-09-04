import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import fastifyStatic from '@fastify/static'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import fastify from 'fastify'
import fastifyBcrypt from 'fastify-bcrypt'
import {
    jsonSchemaTransform,
    serializerCompiler,
    validatorCompiler,
    ZodTypeProvider,
} from 'fastify-type-provider-zod'
import path from 'path'
import { registerStripeWebhook } from '../src/controllers/webhook'
import { env } from '../src/env'
import { routes } from '../src/routes/main'

// Declaração de tipo para o decorator
declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply,
    ) => Promise<void>
  }
}

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

const publicFolder = path.join(__dirname, '..', 'public')

// Arquivos estáticos
app.register(fastifyStatic, {
  root: publicFolder,
  prefix: '/',
})

// CORS
app.register(fastifyCors, {
  origin: true,
})

// Bcrypt
app.register(fastifyBcrypt, {
  saltWorkFactor: 10,
})

// JWT
app.register(fastifyJwt, {
  secret: env.JWT_SECRET_KEY,
})

// Decorator de autenticação
app.decorate('authenticate', async function (request, reply): Promise<void> {
  try {
    await request.jwtVerify()
  } catch {
    reply.status(401).send({ message: 'Não autorizado' })
  }
})

// Swagger
app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'B7Store Backend',
      version: '0.0.1',
      description: 'API para a B7Store',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  transform: jsonSchemaTransform,
})

// Swagger UI
app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})

app.register(registerStripeWebhook)
// Rotas
app.register(routes)

// Handler de erro
app.setErrorHandler((error, request, reply) => {
  if (error.validation) {
    return reply.status(400).send({
      error: error.message,
    })
  }
  reply.status(500).send({ error: 'Internal Server Error' })
})

// Start do servidor
export default async (req: any, res: any) => {
  await app.ready()
  app.server.emit('request', req, res)
}
