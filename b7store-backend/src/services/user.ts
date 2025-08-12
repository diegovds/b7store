import { prisma } from '../libs/prisma'
import { Address } from '../types/address'

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

export const createAddress = async (userId: number, address: Address) => {
  return await prisma.userAddress.create({
    data: {
      ...address,
      userId,
    },
  })
}

export const getAddressesFromUserId = async (userId: number) => {
  return await prisma.userAddress.findMany({
    where: { userId },
    select: {
      id: true,
      zipcode: true,
      street: true,
      number: true,
      city: true,
      state: true,
      country: true,
      complement: true,
    },
  })
}

export const getAddressById = async (userId: number, addressId: number) => {
  return prisma.userAddress.findFirst({
    where: { id: addressId, userId },
    select: {
      id: true,
      zipcode: true,
      street: true,
      number: true,
      city: true,
      state: true,
      country: true,
      complement: true,
    },
  })
}
