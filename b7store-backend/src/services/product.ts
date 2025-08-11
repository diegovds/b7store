import { db } from '../drizzle/drizzle'

interface ProductFilters {
  metadata?: { [key: string]: string }
  order?: string
  limit?: number
}

export const getAllProducts = async ({
  limit,
  metadata,
  order,
}: ProductFilters) => {
  const orderBy = (fields, { asc, desc }) => {
    switch (order) {
      case 'views':
        return [desc(fields.viewsCount)]
      case 'selling':
        return [desc(fields.salesCount)]
      case 'price':
        return [asc(fields.price)]
      default:
        return [desc(fields.viewsCount)]
    }
  }

  const where: any = {}
  if (metadata && typeof metadata === 'object') {
    const metaFilters = []
    for (const categoryMetadataId in metadata) {
      const value = metadata[categoryMetadataId]
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

  const products = await db.query.products.findMany({
    columns: {
      id: true,
      label: true,
      price: true,
    },
    with: {
      images: {
        columns: {
          url: true,
        },
      },
    },
  })

  return products.map((product) => ({
    ...product,
    image: product.images[0] ? `media/products/${product.images[0].url}` : null,
    images: undefined,
  }))
}
