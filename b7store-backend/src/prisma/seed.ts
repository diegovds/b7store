import removeAccents from 'remove-accents'
import { PrismaClient } from '../generated/prisma'

const prisma = new PrismaClient()

async function main() {
  const existingCategory = await prisma.category.findFirst({
    where: { slug: 'camisetas' },
  })

  if (existingCategory) {
    console.log('✅ Database has already been seeded. Skipping.')
    return
  }

  const category1 = await prisma.category.create({
    data: { slug: 'camisetas', name: 'Camisetas' },
  })
  const category2 = await prisma.category.create({
    data: { slug: 'bones', name: 'Bonés' },
  })
  console.log('✅ Category created')

  const categoryMetadata = await prisma.categoryMetadata.create({
    data: { id: 'tech', name: 'Tecnologia', categoryId: category1.id },
  })
  console.log('✅ Category Metadata created')

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

  await createProductWithMetadata({
    label: 'Camiseta React - Azul',
    price: 94.5,
    description:
      'Camiseta com logo do React, azul, ideal para front-end developers',
    categoryId: category1.id,
    images: ['product_1_1.png'],
    metadataIds: ['react'],
  })
  await createProductWithMetadata({
    label: 'Camiseta React - Cinza',
    price: 94.5,
    description:
      'Camiseta com logo do React, cinza, ideal para front-end developers',
    categoryId: category1.id,
    images: ['product_1_2.png'],
    metadataIds: ['react'],
  })
  await createProductWithMetadata({
    label: 'Camiseta React - Preta',
    price: 94.5,
    description:
      'Camiseta com logo do React, preta, ideal para front-end developers',
    categoryId: category1.id,
    images: ['product_1_3.png'],
    metadataIds: ['react'],
  })
  console.log('✅ Camisetas React created')

  await createProductWithMetadata({
    label: 'Camiseta React Native - Azul Escuro',
    price: 89.9,
    description:
      'Camiseta com estampa React Native, azul escuro, perfeita para mobile developers',
    categoryId: category1.id,
    images: ['product_2_1.png'],
    metadataIds: ['react-native'],
  })
  console.log('✅ Camiseta React Native created')

  await createProductWithMetadata({
    label: 'Camiseta PHP - Azul',
    price: 69.9,
    description:
      'Camiseta com estampa PHP, azul, ideal para desenvolvedores web',
    categoryId: category1.id,
    images: ['product_3_1.png'],
    metadataIds: ['php'],
  })
  await createProductWithMetadata({
    label: 'Camiseta PHP - Cinza',
    price: 69.9,
    description:
      'Camiseta com estampa PHP, cinza, ideal para desenvolvedores web',
    categoryId: category1.id,
    images: ['product_3_2.png'],
    metadataIds: ['php'],
  })
  console.log('✅ Camisetas PHP created')

  await createProductWithMetadata({
    label: 'Camiseta Node.js - Verde',
    price: 79.9,
    description:
      'Camiseta com estampa Node.js, verde, perfeita para programadores back-end',
    categoryId: category1.id,
    images: ['product_4_1.png'],
    metadataIds: ['node'],
  })
  await createProductWithMetadata({
    label: 'Camiseta Node.js - Preta',
    price: 79.9,
    description:
      'Camiseta com estampa Node.js, preta, perfeita para programadores back-end',
    categoryId: category1.id,
    images: ['product_4_2.png'],
    metadataIds: ['node'],
  })
  console.log('✅ Camisetas Node.js created')

  await createProductWithMetadata({
    label: 'Camiseta Laravel - Vermelha',
    price: 59.9,
    description: 'Camiseta com estampa Laravel, vermelha, ideal para devs PHP',
    categoryId: category1.id,
    images: ['product_5_1.png'],
    metadataIds: ['laravel'],
  })
  await createProductWithMetadata({
    label: 'Camiseta Laravel - Azul',
    price: 59.9,
    description: 'Camiseta com estampa Laravel, azul, ideal para devs PHP',
    categoryId: category1.id,
    images: ['product_5_2.png'],
    metadataIds: ['laravel'],
  })
  await createProductWithMetadata({
    label: 'Camiseta Laravel - Branca',
    price: 59.9,
    description: 'Camiseta com estampa Laravel, branca, ideal para devs PHP',
    categoryId: category1.id,
    images: ['product_5_3.png'],
    metadataIds: ['laravel'],
  })
  await createProductWithMetadata({
    label: 'Camiseta Laravel - Preta',
    price: 59.9,
    description: 'Camiseta com estampa Laravel, preta, ideal para devs PHP',
    categoryId: category1.id,
    images: ['product_5_4.png'],
    metadataIds: ['laravel'],
  })
  console.log('✅ Camisetas Laravel created')

  await createProductWithMetadata({
    label: 'Camiseta Web Base - CSS Azul',
    price: 49.9,
    description: 'Camiseta com design CSS, azul, base da web',
    categoryId: category1.id,
    images: ['product_8_1.png'],
    metadataIds: ['css'],
  })
  await createProductWithMetadata({
    label: 'Camiseta Web Base - JS Laranja',
    price: 49.9,
    description: 'Camiseta com design JavaScript, laranja, base da web',
    categoryId: category1.id,
    images: ['product_8_2.png'],
    metadataIds: ['javascript'],
  })
  await createProductWithMetadata({
    label: 'Camiseta Web Base - HTML Amarela',
    price: 49.9,
    description: 'Camiseta com design HTML, amarela, base da web',
    categoryId: category1.id,
    images: ['product_8_3.png'],
    metadataIds: ['html'],
  })
  console.log('✅ Camisetas Web Base created')

  await createProductWithMetadata({
    label: 'Boné B7Web - Azul',
    price: 39.9,
    description: 'Boné B7Web azul escuro',
    categoryId: category2.id,
    images: ['product_6_1.png'],
  })
  await createProductWithMetadata({
    label: 'Boné B7Web - Preto',
    price: 39.9,
    description: 'Boné B7Web preto',
    categoryId: category2.id,
    images: ['product_6_2.png'],
  })
  await createProductWithMetadata({
    label: 'Boné B7Web - Cinza Escuro',
    price: 39.9,
    description: 'Boné B7Web cinza escuro',
    categoryId: category2.id,
    images: ['product_6_3.png'],
  })
  await createProductWithMetadata({
    label: 'Boné B7Web - Azul Claro',
    price: 29.9,
    description: 'Boné B7Web azul claro',
    categoryId: category2.id,
    images: ['product_7_1.png'],
  })
  await createProductWithMetadata({
    label: 'Boné B7Web - Cinza Claro',
    price: 29.9,
    description: 'Boné B7Web cinza claro',
    categoryId: category2.id,
    images: ['product_7_2.png'],
  })
  await createProductWithMetadata({
    label: 'Boné B7Web - Branco',
    price: 29.9,
    description: 'Boné B7Web branco',
    categoryId: category2.id,
    images: ['product_7_3.png'],
  })
  console.log('✅ Bonés created')

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
