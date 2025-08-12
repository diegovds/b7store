import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { createUser, logUser } from '../services/user'

export const register: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/user/register',
    {
      schema: {
        summary: 'Register a new user.',
        tags: ['user'],
        security: [],
        body: z.object({
          name: z.string().min(2),
          email: z.email(),
          password: z.string().min(4),
        }),
        response: {
          201: z.object({
            error: z.string().nullable(),
            user: z.object({
              id: z.number(),
              name: z.string(),
              email: z.string(),
            }),
          }),
          400: z.object({
            error: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { email, name, password } = request.body
      const passwordHash = await app.bcrypt.hash(password)

      const user = await createUser(name, email, passwordHash)
      if (!user) {
        reply.status(400).send({ error: 'E-mail já cadastrado' })
        return
      }

      return reply.status(201).send({ error: null, user })
    },
  )
}

export const login: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/user/login',
    {
      schema: {
        summary: 'Login and receive a token.',
        tags: ['user'],
        security: [],
        body: z.object({
          email: z.email(),
          password: z.string().min(4),
        }),
        response: {
          200: z.object({
            error: z.string().nullable(),
            token: z.string(),
          }),
          400: z.object({
            error: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { email, password } = request.body

      const { user } = await logUser(email)

      if (user !== null) {
        const passwordVerify = await app.bcrypt.compare(password, user.password)

        if (passwordVerify) {
          const token = app.jwt.sign(
            {
              name: user.name,
            },
            {
              sub: String(user.id),
              expiresIn: '30 days',
            },
          )

          return reply.status(200).send({ error: null, token })
        }

        return reply.status(404).send({
          error: 'Usuário não encontrado.',
        })
      }

      return reply.status(404).send({
        error: 'Usuário não encontrado.',
      })
    },
  )
}
