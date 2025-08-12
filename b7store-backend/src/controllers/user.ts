import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { createAddress, createUser, logUser } from '../services/user'

const addressSchema = z.object({
  zipcode: z
    .string()
    .regex(/^\d{5}-\d{3}$/, 'O CEP deve estar no formato 12345-678'),
  street: z.string().min(1, 'Rua é obrigatória'),
  number: z.string().min(1, 'Número é obrigatório'),
  city: z.string().min(1, 'Cidade é obrigatória'),
  state: z.string().min(1, 'Estado é obrigatório'),
  country: z.string().min(1, 'País é obrigatório'),
  complement: z.string().nullable(),
})

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

export const addAddress: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/user/addresses',
    {
      schema: {
        summary: 'Add a new address for the logged-in user.',
        tags: ['user'],
        security: [{ bearerAuth: [] }],
        body: addressSchema,
        response: {
          200: z.object({
            error: z.string().nullable(),
            address: addressSchema.extend({ id: z.number() }),
          }),
        },
      },
      preHandler: [app.authenticate],
    },
    async (request, reply) => {
      const address = request.body

      const newAddress = await createAddress(
        parseInt(request.user.sub),
        address,
      )

      return reply.status(200).send({ error: null, address: newAddress })
    },
  )
}
