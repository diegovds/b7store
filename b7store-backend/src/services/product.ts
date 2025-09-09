import removeAccents from 'remove-accents'
import { prisma } from '../libs/prisma'

type ProductOrder = 'views' | 'selling' | 'price'

interface ProductFilters {
  metadata?: { [key: string]: string }
  order?: ProductOrder
  limit?: number
  categoryId?: number
  q?: string
}

export const getProducts = async (filters: ProductFilters) => {
  // Organize ORDER
  let orderBy: any = {}
  switch (filters.order) {
    case 'views':
      orderBy = { viewsCount: 'desc' }
      break
    case 'selling':
      orderBy = { salesCount: 'desc' }
      break
    case 'price':
      orderBy = { price: 'asc' }
      break
    default:
      orderBy = { viewsCount: 'desc' }
      break
  }

  // Organize WHERE
  const andFilters: any[] = []

  // Categoria
  if (filters.categoryId) {
    andFilters.push({ categoryId: filters.categoryId })
  }

  // Metadata
  if (filters.metadata && typeof filters.metadata === 'object') {
    for (const categoryMetadataId in filters.metadata) {
      const value = filters.metadata[categoryMetadataId]
      if (typeof value !== 'string') continue
      const valueIds = value
        .split('|')
        .map((v) => v.trim())
        .filter(Boolean)
      if (valueIds.length === 0) continue

      andFilters.push({
        metadata: {
          some: {
            categoryMetadataId,
            metadataValueId: { in: valueIds },
          },
        },
      })
    }
  }

  // Busca por termo (label ou description)
  if (filters.q && filters.q.trim() !== '') {
    const searchTerm = removeAccents(filters.q.trim())

    andFilters.push({
      OR: [
        { labelSearch: { contains: searchTerm, mode: 'insensitive' } },
        { descriptionSearch: { contains: searchTerm, mode: 'insensitive' } },
        {
          metadata: {
            some: {
              metadataValue: {
                label: { contains: searchTerm, mode: 'insensitive' },
              },
            },
          },
        },
      ],
    })
  }

  // Se não houver filtros, passar undefined
  const where = andFilters.length > 0 ? { AND: andFilters } : undefined

  const products = await prisma.product.findMany({
    select: {
      id: true,
      label: true,
      price: true,
      images: {
        take: 1,
        orderBy: { id: 'asc' },
      },
      categoryId: true,
    },
    where,
    orderBy,
    take: filters.limit ?? undefined,
  })

  return products.map((product) => ({
    ...product,
    image: product.images[0] ? `media/products/${product.images[0].url}` : null,
    images: undefined,
  }))
}

export const getProduct = async (id: number) => {
  const product = await prisma.product.findUnique({
    where: { id },
    select: {
      id: true,
      label: true,
      price: true,
      description: true,
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      images: true,
    },
  })

  if (!product) return null

  return {
    ...product,
    images:
      product.images.length > 0
        ? product.images.map((img) => `media/products/${img.url}`)
        : [],
  }
}

export const incrementProductView = async (id: number) => {
  await prisma.product.update({
    where: { id },
    data: {
      viewsCount: { increment: 1 },
    },
  })
}

export const getProductsFromSameCategory = async (
  id: number,
  limit: number = 4,
) => {
  const product = await prisma.product.findUnique({
    where: { id },
    select: { categoryId: true },
  })
  if (!product) return []

  const products = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: id },
    },
    select: {
      id: true,
      label: true,
      price: true,
      images: {
        take: 1,
        orderBy: { id: 'asc' },
      },
    },
    take: limit,
    orderBy: { viewsCount: 'desc' },
  })

  return products.map((product) => ({
    ...product,
    image: product.images[0] ? `media/products/${product.images[0].url}` : null,
    images: undefined,
  }))
}
