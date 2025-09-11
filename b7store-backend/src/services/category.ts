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

export const getCategoryMetadata = async (categoryId: number) => {
  // Buscar metadatas da categoria + globais
  const metadata = await prisma.categoryMetadata.findMany({
    where: {
      OR: [
        { categoryId },
        { categoryId: null }, // global
      ],
    },
    select: {
      id: true,
      name: true,
    },
  })

  // Buscar todos os valores de metadata que estão ligados a produtos da categoria
  const values = await prisma.metadataValue.findMany({
    where: {
      ProductMetadata: {
        some: {
          product: {
            categoryId,
          },
        },
      },
    },
    select: {
      id: true,
      label: true,
      categoryMetadataId: true,
    },
  })

  // Reestruturar para agrupar os valores dentro da metadata correspondente
  const metadataWithValues = metadata.map((meta) => ({
    ...meta,
    values: values.filter((v) => v.categoryMetadataId === meta.id),
  }))

  return metadataWithValues
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
