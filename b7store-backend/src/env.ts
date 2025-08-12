import { z } from 'zod'

const envSchema = z.object({
  PORT: z.coerce.number().default(3333),
  DATABASE_URL: z.string(),
  JWT_SECRET_KEY: z.string(),
  BASE_URL: z.string(),
  STRIPE_SECRET_KEY: z.string(),
  FRONTEND_URL: z.string(),
  STRIPE_WEBHOOK_SECRET: z.string(),
})

export const env = envSchema.parse(process.env)
