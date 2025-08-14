import { PrismaClient } from '../generated/prisma'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Check if seeding has already been done
  console.log('Checking if database has already been seeded...')
  const existingCategory = await prisma.category.findFirst({
    where: {
      slug: 'camisas',
    },
  })

  if (existingCategory) {
    console.log(
      '✅ Database has already been seeded. Skipping to avoid duplicate records.',
    )
    console.log('Found existing category:', existingCategory.name)
    return
  }

  console.log('📝 No existing data found. Proceeding with seeding...')

  // Create Category
  console.log('Creating category...')
  const category = await prisma.category.create({
    data: {
      slug: 'camisas',
      name: 'Camisas',
    },
  })
  console.log('✅ Category created:', category.name)

  // Create CategoryMetadata
  console.log('Creating category metadata...')
  const categoryMetadata = await prisma.categoryMetadata.create({
    data: {
      id: 'tech',
      name: 'Tecnologia',
      categoryId: category.id,
    },
  })
  console.log('✅ Category metadata created:', categoryMetadata.name)

  // Create Banners
  console.log('Creating banners...')
  const banners = await Promise.all([
    prisma.banner.create({
      data: {
        img: 'banner_promo_1.jpg',
        link: '/categories/camisas',
      },
    }),
    prisma.banner.create({
      data: {
        img: 'banner_promo_2.jpg',
        link: '/categories/algo',
      },
    }),
    prisma.banner.create({
      data: {
        img: 'banner_promo_3.png',
        link: '/categories/node',
      },
    }),
    prisma.banner.create({
      data: {
        img: 'banner_promo_4.png',
        link: '/categories/php',
      },
    }),
  ])
  console.log('✅ Banners created:', banners.length)

  // Create MetadataValues
  console.log('Creating metadata values...')
  const metadataValues = await Promise.all([
    prisma.metadataValue.create({
      data: {
        id: 'node',
        label: 'Node',
        categoryMetadataId: 'tech',
      },
    }),
    prisma.metadataValue.create({
      data: {
        id: 'react',
        label: 'React',
        categoryMetadataId: 'tech',
      },
    }),
    prisma.metadataValue.create({
      data: {
        id: 'python',
        label: 'Python',
        categoryMetadataId: 'tech',
      },
    }),
    prisma.metadataValue.create({
      data: {
        id: 'php',
        label: 'PHP',
        categoryMetadataId: 'tech',
      },
    }),
  ])
  console.log('✅ Metadata values created:', metadataValues.length)

  // Create Products
  let product = await prisma.product.create({
    data: {
      label: 'Camisa React',
      price: 94.5,
      description: 'Camisa com logo do React, ideal para front-end developers',
      categoryId: category.id,
    },
  })
  for (let i = 1; i <= 3; i++) {
    await prisma.productImage.create({
      data: {
        productId: product.id,
        url: `product_1_${i}.png`,
      },
    })
  }

  product = await prisma.product.create({
    data: {
      label: 'Camisa RN',
      price: 89.9,
      description:
        'Camisa com estampa de React Native, perfeita para desenvolvedores',
      categoryId: category.id,
    },
  })
  await prisma.productImage.create({
    data: {
      productId: product.id,
      url: 'product_2_1.png',
    },
  })

  product = await prisma.product.create({
    data: {
      label: 'Camisa PHP',
      price: 69.9,
      description: 'Camisa com estampa PHP, para desenvolvedores web',
      categoryId: category.id,
    },
  })
  for (let i = 1; i <= 2; i++) {
    await prisma.productImage.create({
      data: {
        productId: product.id,
        url: `product_3_${i}.png`,
      },
    })
  }

  product = await prisma.product.create({
    data: {
      label: 'Camisa Node',
      price: 79.9,
      description: 'Camisa com design Node, para programadores Node',
      categoryId: category.id,
    },
  })
  for (let i = 1; i <= 2; i++) {
    await prisma.productImage.create({
      data: {
        productId: product.id,
        url: `product_4_${i}.png`,
      },
    })
  }

  console.log('✅ Products created')

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
