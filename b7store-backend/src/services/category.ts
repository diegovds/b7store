import removeAccents from 'remove-accents'
import { prisma } from '../libs/prisma'

export const getCategoryBySlug = async (slug: string) => {
  const category = await prisma.category.findFirst({
    where: { slug },
    select: {
      id: true,
      name: true,
      slug: true,
    },
  })
  return category
}

export const getCategoryById = async (id: number) => {
  const category = await prisma.category.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      slug: true,
    },
  })
  return category
}

export const getCategoryMetadata = async (id: number) => {
  const metadata = await prisma.categoryMetadata.findMany({
    where: { categoryId: id },
    select: {
      id: true,
      name: true,
      values: {
        select: {
          id: true,
          label: true,
        },
      },
    },
  })
  return metadata
}

export const getCategorySearchMetadata = async (q: string) => {
  const searchTerm = removeAccents(q.trim())

  const products = await prisma.product.findMany({
    select: {
      metadata: {
        select: {
          metadataValue: {
            select: {
              id: true,
              label: true,
              categoryMetadata: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      },
    },
    where: {
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
    },
  })

  // Agrupar metadados
  const groupedMetadata: Record<
    string,
    {
      id: string
      name: string
      values: { id: string; label: string }[]
    }
  > = {}

  for (const product of products) {
    for (const m of product.metadata) {
      const cat = m.metadataValue.categoryMetadata
      if (!groupedMetadata[cat.id]) {
        groupedMetadata[cat.id] = {
          id: cat.id,
          name: cat.name,
          values: [],
        }
      }

      if (
        !groupedMetadata[cat.id].values.some((v) => v.id === m.metadataValue.id)
      ) {
        groupedMetadata[cat.id].values.push({
          id: m.metadataValue.id,
          label: m.metadataValue.label,
        })
      }
    }
  }

  return Object.values(groupedMetadata)
}
