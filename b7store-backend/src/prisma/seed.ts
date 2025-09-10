import removeAccents from 'remove-accents'
import { PrismaClient } from '../generated/prisma'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  const existingCategory = await prisma.category.findFirst({
    where: { slug: 'camisetas' },
  })

  if (existingCategory) {
    console.log('✅ Database has already been seeded. Skipping.')
    return
  }

  console.log('📝 No existing data found. Proceeding with seeding...')

  // Categories
  const category1 = await prisma.category.create({
    data: { slug: 'camisetas', name: 'Camisetas' },
  })
  const category2 = await prisma.category.create({
    data: { slug: 'bones', name: 'Bonés' },
  })

  // CategoryMetadata
  const categoryMetadata = await prisma.categoryMetadata.create({
    data: { id: 'tech', name: 'Tecnologia', categoryId: category1.id },
  })

  // Banners
  await Promise.all([
    prisma.banner.create({
      data: { img: 'banner_promo_1.jpg', link: '/categories/camisetas' },
    }),
    prisma.banner.create({
      data: {
        img: 'banner_promo_2.jpg',
        link: '/categories/camisetas?tech=php',
      },
    }),
    prisma.banner.create({
      data: {
        img: 'banner_promo_3.png',
        link: '/categories/camisetas?tech=node',
      },
    }),
    prisma.banner.create({
      data: {
        img: 'banner_promo_4.png',
        link: '/categories/camisetas?tech=php',
      },
    }),
  ])

  // MetadataValues
  await Promise.all([
    prisma.metadataValue.create({
      data: { id: 'node', label: 'Node', categoryMetadataId: 'tech' },
    }),
    prisma.metadataValue.create({
      data: { id: 'react', label: 'React', categoryMetadataId: 'tech' },
    }),
    prisma.metadataValue.create({
      data: { id: 'php', label: 'PHP', categoryMetadataId: 'tech' },
    }),
  ])

  console.log('✅ Metadata values created')

  // Helper function para criar produto com imagens e metadata
  async function createProductWithMetadata(data: {
    label: string
    price: number
    description: string
    categoryId: number
    images: string[]
    metadataIds?: string[]
  }) {
    const product = await prisma.product.create({
      data: {
        label: data.label,
        labelSearch: removeAccents(data.label),
        price: data.price,
        description: data.description,
        descriptionSearch: removeAccents(data.description),
        categoryId: data.categoryId,
      },
    })

    for (const url of data.images) {
      await prisma.productImage.create({
        data: { productId: product.id, url },
      })
    }

    if (data.metadataIds && data.metadataIds.length > 0) {
      for (const metadataId of data.metadataIds) {
        await prisma.productMetadata.create({
          data: {
            productId: product.id,
            categoryMetadataId: categoryMetadata.id,
            metadataValueId: metadataId,
          },
        })
      }
    }
  }

  // Criando produtos com imagens e metadata
  await createProductWithMetadata({
    label: 'Camisa React',
    price: 94.5,
    description: 'Camisa com logo do React, ideal para front-end developers',
    categoryId: category1.id,
    images: ['product_1_1.png', 'product_1_2.png', 'product_1_3.png'],
    metadataIds: ['react'],
  })

  await createProductWithMetadata({
    label: 'Camisa RN',
    price: 89.9,
    description:
      'Camisa com estampa de React Native, perfeita para desenvolvedores',
    categoryId: category1.id,
    images: ['product_2_1.png'],
    metadataIds: ['react'],
  })

  await createProductWithMetadata({
    label: 'Camisa PHP',
    price: 69.9,
    description: 'Camisa com estampa PHP, para desenvolvedores web',
    categoryId: category1.id,
    images: ['product_3_1.png', 'product_3_2.png'],
    metadataIds: ['php'],
  })

  await createProductWithMetadata({
    label: 'Camisa Node',
    price: 79.9,
    description: 'Camisa com design Node, para programadores Node',
    categoryId: category1.id,
    images: ['product_4_1.png', 'product_4_2.png'],
    metadataIds: ['node'],
  })

  await createProductWithMetadata({
    label: 'Camisa Laravel',
    price: 59.9,
    description: 'Camisa com design Laravel, para programadores Laravel',
    categoryId: category1.id,
    images: [
      'product_5_1.png',
      'product_5_2.png',
      'product_5_3.png',
      'product_5_4.png',
    ],
    metadataIds: ['php'],
  })

  await createProductWithMetadata({
    label: 'Boné 1',
    price: 39.9,
    description: 'Boné com design B7Web com cores escuras',
    categoryId: category2.id,
    images: ['product_6_1.png', 'product_6_2.png', 'product_6_3.png'],
  })

  await createProductWithMetadata({
    label: 'Boné 2',
    price: 29.9,
    description: 'Boné com design B7Web, para programadores estilosos',
    categoryId: category2.id,
    images: ['product_7_1.png', 'product_7_2.png', 'product_7_3.png'],
  })

  await createProductWithMetadata({
    label: 'Camisa Base da Web',
    price: 49.9,
    description: 'Camisa com design das tecnologias base da web.',
    categoryId: category1.id,
    images: ['product_8_1.png', 'product_8_2.png', 'product_8_3.png'],
    metadataIds: ['node', 'react', 'php'],
  })

  console.log('✅ Products with metadata created')
  console.log('🎉 Database seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
