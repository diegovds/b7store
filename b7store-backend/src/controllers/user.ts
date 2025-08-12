import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { createUser } from '../services/user'

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
          200: z.object({
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

      return reply.status(200).send({ error: null, user })
    },
  )
}
