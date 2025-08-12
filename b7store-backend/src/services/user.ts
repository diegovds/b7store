import { prisma } from '../libs/prisma'

export const createUser = async (
  name: string,
  email: string,
  password: string,
) => {
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) return null

  const user = await prisma.user.create({
    data: {
      name,
      email: email.toLowerCase(),
      password,
    },
  })

  if (!user) return null

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  }
}

export const logUser = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } })

  return { user }
}
