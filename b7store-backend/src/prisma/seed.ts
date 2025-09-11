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

  const category1 = await prisma.category.create({
    data: { slug: 'camisetas', name: 'Camisetas' },
  })
  const category2 = await prisma.category.create({
    data: { slug: 'bones', name: 'Bonés' },
  })

  const categoryMetadata = await prisma.categoryMetadata.create({
    data: { id: 'tech', name: 'Tecnologia', categoryId: category1.id },
  })

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
  console.log('✅ Banners created')

  await Promise.all([
    prisma.metadataValue.create({
      data: {
        id: 'node',
        label: 'Node',
        categoryMetadataId: categoryMetadata.id,
      },
    }),
    prisma.metadataValue.create({
      data: {
        id: 'react',
        label: 'React',
        categoryMetadataId: categoryMetadata.id,
      },
    }),
    prisma.metadataValue.create({
      data: {
        id: 'php',
        label: 'PHP',
        categoryMetadataId: categoryMetadata.id,
      },
    }),
    prisma.metadataValue.create({
      data: {
        id: 'react-native',
        label: 'React Native',
        categoryMetadataId: categoryMetadata.id,
      },
    }),
    prisma.metadataValue.create({
      data: {
        id: 'laravel',
        label: 'Laravel',
        categoryMetadataId: categoryMetadata.id,
      },
    }),
    prisma.metadataValue.create({
      data: {
        id: 'css',
        label: 'CSS',
        categoryMetadataId: categoryMetadata.id,
      },
    }),
    prisma.metadataValue.create({
      data: {
        id: 'javascript',
        label: 'JavaScript',
        categoryMetadataId: categoryMetadata.id,
      },
    }),
    prisma.metadataValue.create({
      data: {
        id: 'html',
        label: 'HTML',
        categoryMetadataId: categoryMetadata.id,
      },
    }),
  ])
  console.log('✅ Metadata values created')

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
      await prisma.productImage.create({ data: { productId: product.id, url } })
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

  // Camisetas React
  await createProductWithMetadata({
    label: 'Camiseta React - Azul',
    price: 94.5,
    description:
      'Camiseta de alta qualidade com logo do React em destaque na cor azul...',
    categoryId: category1.id,
    images: ['product_1_1.png'],
    metadataIds: ['react'],
  })
  await createProductWithMetadata({
    label: 'Camiseta React - Cinza',
    price: 94.5,
    description: 'Camiseta de alta qualidade com logo do React na cor cinza...',
    categoryId: category1.id,
    images: ['product_1_2.png'],
    metadataIds: ['react'],
  })
  await createProductWithMetadata({
    label: 'Camiseta React - Preta',
    price: 94.5,
    description:
      'Camiseta elegante e confortável com logo do React na cor preta...',
    categoryId: category1.id,
    images: ['product_1_3.png'],
    metadataIds: ['react'],
  })

  // Camiseta React Native
  await createProductWithMetadata({
    label: 'Camiseta React Native - Azul Escuro',
    price: 89.9,
    description:
      'Camiseta exclusiva com estampa React Native em azul escuro...',
    categoryId: category1.id,
    images: ['product_2_1.png'],
    metadataIds: ['react', 'react-native'],
  })

  // Camisetas PHP
  await createProductWithMetadata({
    label: 'Camiseta PHP - Azul',
    price: 60.0,
    description: 'Camiseta confortável com estampa PHP na cor azul...',
    categoryId: category1.id,
    images: ['product_3_1.png'],
    metadataIds: ['php'],
  })
  await createProductWithMetadata({
    label: 'Camiseta PHP - Cinza',
    price: 69.9,
    description: 'Camiseta macia e resistente com estampa PHP cinza...',
    categoryId: category1.id,
    images: ['product_3_2.png'],
    metadataIds: ['php'],
  })

  // Camisetas Node.js
  await createProductWithMetadata({
    label: 'Camiseta Node.js - Verde',
    price: 60.0,
    description: 'Camiseta moderna com estampa Node.js verde...',
    categoryId: category1.id,
    images: ['product_4_1.png'],
    metadataIds: ['node', 'javascript'],
  })
  await createProductWithMetadata({
    label: 'Camiseta Node.js - Preta',
    price: 79.9,
    description: 'Camiseta preta confortável com estampa Node.js...',
    categoryId: category1.id,
    images: ['product_4_2.png'],
    metadataIds: ['node', 'javascript'],
  })

  // Camisetas Laravel
  await createProductWithMetadata({
    label: 'Camiseta Laravel - Vermelha',
    price: 60.0,
    description: 'Camiseta vermelha com estampa Laravel...',
    categoryId: category1.id,
    images: ['product_5_1.png'],
    metadataIds: ['php', 'laravel'],
  })
  await createProductWithMetadata({
    label: 'Camiseta Laravel - Azul',
    price: 59.9,
    description: 'Camiseta azul com estampa Laravel...',
    categoryId: category1.id,
    images: ['product_5_2.png'],
    metadataIds: ['php', 'laravel'],
  })
  await createProductWithMetadata({
    label: 'Camiseta Laravel - Branca',
    price: 60.0,
    description: 'Camiseta branca com estampa Laravel...',
    categoryId: category1.id,
    images: ['product_5_3.png'],
    metadataIds: ['php', 'laravel'],
  })
  await createProductWithMetadata({
    label: 'Camiseta Laravel - Preta',
    price: 59.9,
    description: 'Camiseta preta com estampa Laravel...',
    categoryId: category1.id,
    images: ['product_5_4.png'],
    metadataIds: ['php', 'laravel'],
  })

  // Camisetas Web Base
  await createProductWithMetadata({
    label: 'Camiseta CSS Azul',
    price: 60.0,
    description: 'Camiseta azul com design CSS...',
    categoryId: category1.id,
    images: ['product_8_1.png'],
    metadataIds: ['css'],
  })
  await createProductWithMetadata({
    label: 'Camiseta JS Amarela',
    price: 49.9,
    description: 'Camiseta amarela com design JavaScript...',
    categoryId: category1.id,
    images: ['product_8_3.png'],
    metadataIds: ['javascript', 'react'],
  })
  await createProductWithMetadata({
    label: 'Camiseta HTML Laranja',
    price: 49.9,
    description: 'Camiseta laranja com design HTML...',
    categoryId: category1.id,
    images: ['product_8_2.png'],
    metadataIds: ['html'],
  })

  // Bonés Escuros
  await createProductWithMetadata({
    label: 'Boné B7Web - Azul',
    price: 39.9,
    description:
      'Boné B7Web azul escuro, perfeito para proteção solar com estilo casual...',
    categoryId: category2.id,
    images: ['product_6_1.png'],
  })
  await createProductWithMetadata({
    label: 'Boné B7Web - Preto',
    price: 39.9,
    description: 'Boné B7Web preto, confortável e estiloso...',
    categoryId: category2.id,
    images: ['product_6_2.png'],
  })
  await createProductWithMetadata({
    label: 'Boné B7Web - Cinza Escuro',
    price: 39.9,
    description: 'Boné B7Web cinza escuro, leve e durável...',
    categoryId: category2.id,
    images: ['product_6_3.png'],
  })

  // Bonés Claros
  await createProductWithMetadata({
    label: 'Boné B7Web - Azul Claro',
    price: 29.9,
    description: 'Boné B7Web azul claro, confortável e leve...',
    categoryId: category2.id,
    images: ['product_7_1.png'],
  })
  await createProductWithMetadata({
    label: 'Boné B7Web - Cinza Claro',
    price: 29.9,
    description: 'Boné B7Web cinza claro, estiloso e confortável...',
    categoryId: category2.id,
    images: ['product_7_2.png'],
  })
  await createProductWithMetadata({
    label: 'Boné B7Web - Branco',
    price: 29.9,
    description: 'Boné B7Web branco, clássico e leve...',
    categoryId: category2.id,
    images: ['product_7_3.png'],
  })

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
