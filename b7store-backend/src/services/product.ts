import { prisma } from '../libs/prisma'

interface ProductFilters {
  metadata?: { [key: string]: string }
  order?: string
  limit?: number
}
export const getProducts = async (filters: ProductFilters) => {
  // Organize ORDER
  let orderBy = {}
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

  // Organize Metadata
  const where: any = {}
  if (filters.metadata && typeof filters.metadata === 'object') {
    const metaFilters = []
    for (const categoryMetadataId in filters.metadata) {
      const value = filters.metadata[categoryMetadataId]
      if (typeof value !== 'string') continue
      const valueIds = value
        .split('|')
        .map((v) => v.trim())
        .filter(Boolean)
      if (valueIds.length === 0) continue

      metaFilters.push({
        metadata: {
          some: {
            categoryMetadataId,
            metadataValueId: { in: valueIds },
          },
        },
      })
    }
    if (metaFilters.length > 0) {
      where.AND = metaFilters
    }
  }

  const products = await prisma.product.findMany({
    select: {
      id: true,
      label: true,
      price: true,
      images: {
        take: 1,
        orderBy: { id: 'asc' },
      },
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
