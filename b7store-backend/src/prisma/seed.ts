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

  const categoryMetadata2 = await prisma.categoryMetadata.create({
    data: { id: 'color', name: 'Cor', categoryId: category2.id },
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

  await Promise.all([
    prisma.metadataValue.create({
      data: {
        id: 'azul',
        label: 'Azul',
        categoryMetadataId: categoryMetadata2.id,
      },
    }),
    prisma.metadataValue.create({
      data: {
        id: 'preto',
        label: 'Preto',
        categoryMetadataId: categoryMetadata2.id,
      },
    }),
    prisma.metadataValue.create({
      data: {
        id: 'cinza-escuro',
        label: 'Cinza Escuro',
        categoryMetadataId: categoryMetadata2.id,
      },
    }),
    prisma.metadataValue.create({
      data: {
        id: 'azul-claro',
        label: 'Azul Claro',
        categoryMetadataId: categoryMetadata2.id,
      },
    }),
    prisma.metadataValue.create({
      data: {
        id: 'cinza-claro',
        label: 'Cinza Claro',
        categoryMetadataId: categoryMetadata2.id,
      },
    }),
    prisma.metadataValue.create({
      data: {
        id: 'branco',
        label: 'Branco',
        categoryMetadataId: categoryMetadata2.id,
      },
    }),
  ])
  console.log('✅ Bonés metadataValues created')

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

    // Associar cor para bonés
    if (data.categoryId === category2.id && data.metadataIds) {
      for (const metadataId of data.metadataIds) {
        await prisma.productMetadata.create({
          data: {
            productId: product.id,
            categoryMetadataId: categoryMetadata2.id,
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
      'Camiseta de alta qualidade com logo do React em destaque na cor azul, ideal para desenvolvedores front-end que desejam expressar sua paixão por tecnologia. Confortável, feita com algodão premium, perfeita para o dia a dia, trabalho ou eventos de tecnologia.',
    categoryId: category1.id,
    images: ['product_1_1.png'],
    metadataIds: ['react'],
  })
  await createProductWithMetadata({
    label: 'Camiseta React - Cinza',
    price: 94.5,
    description:
      'Camiseta de alta qualidade com logo do React na cor cinza, feita para desenvolvedores front-end que querem se destacar com estilo e conforto. Produzida em tecido macio, ideal para usar em hackathons, reuniões e eventos de tecnologia.',
    categoryId: category1.id,
    images: ['product_1_2.png'],
    metadataIds: ['react'],
  })
  await createProductWithMetadata({
    label: 'Camiseta React - Preta',
    price: 94.5,
    description:
      'Camiseta elegante e confortável com logo do React na cor preta, perfeita para programadores front-end que desejam unir estilo e paixão por tecnologia. Tecido de alta durabilidade, ideal para o dia a dia ou encontros com a comunidade tech.',
    categoryId: category1.id,
    images: ['product_1_3.png'],
    metadataIds: ['react'],
  })
  console.log('✅ Camisetas React created')

  // Camiseta React Native
  await createProductWithMetadata({
    label: 'Camiseta React Native - Azul Escuro',
    price: 89.9,
    description:
      'Camiseta exclusiva com estampa React Native em azul escuro, feita para desenvolvedores mobile que valorizam conforto e estilo. Tecido premium, perfeito para usar em qualquer ocasião, mostrando sua afinidade com tecnologias mobile modernas.',
    categoryId: category1.id,
    images: ['product_2_1.png'],
    metadataIds: ['react', 'react-native'],
  })
  console.log('✅ Camiseta React Native created')

  // Camisetas PHP
  await createProductWithMetadata({
    label: 'Camiseta PHP - Azul',
    price: 60.0,
    description:
      'Camiseta confortável com estampa PHP na cor azul, ideal para desenvolvedores web que querem demonstrar suas habilidades com estilo. Produzida em algodão de alta qualidade, perfeita para o trabalho, estudo ou eventos de tecnologia.',
    categoryId: category1.id,
    images: ['product_3_1.png'],
    metadataIds: ['php'],
  })
  await createProductWithMetadata({
    label: 'Camiseta PHP - Cinza',
    price: 69.9,
    description:
      'Camiseta macia e resistente com estampa PHP cinza, ideal para programadores web que querem unir conforto e estilo no dia a dia. Excelente para usar em reuniões, cursos ou eventos de tecnologia.',
    categoryId: category1.id,
    images: ['product_3_2.png'],
    metadataIds: ['php'],
  })
  console.log('✅ Camisetas PHP created')

  // Camisetas Node.js
  await createProductWithMetadata({
    label: 'Camiseta Node.js - Verde',
    price: 60.0,
    description:
      'Camiseta moderna com estampa Node.js verde, perfeita para desenvolvedores back-end que querem mostrar sua afinidade com tecnologias de servidor. Tecido de alta qualidade, ideal para uso diário e eventos tech.',
    categoryId: category1.id,
    images: ['product_4_1.png'],
    metadataIds: ['node', 'javascript'],
  })
  await createProductWithMetadata({
    label: 'Camiseta Node.js - Preta',
    price: 79.9,
    description:
      'Camiseta preta confortável com estampa Node.js, ideal para programadores back-end que valorizam estilo e tecnologia. Tecido durável e macio, perfeita para o trabalho, estudo ou encontros de tecnologia.',
    categoryId: category1.id,
    images: ['product_4_2.png'],
    metadataIds: ['node', 'javascript'],
  })
  console.log('✅ Camisetas Node.js created')

  // Camisetas Laravel
  await createProductWithMetadata({
    label: 'Camiseta Laravel - Vermelha',
    price: 60.0,
    description:
      'Camiseta vermelha com estampa Laravel, perfeita para desenvolvedores PHP que desejam conforto e estilo. Tecido premium, ideal para uso diário, cursos, hackathons e eventos de tecnologia.',
    categoryId: category1.id,
    images: ['product_5_1.png'],
    metadataIds: ['php', 'laravel'],
  })
  await createProductWithMetadata({
    label: 'Camiseta Laravel - Azul',
    price: 59.9,
    description:
      'Camiseta azul com estampa Laravel, confortável e resistente, perfeita para desenvolvedores PHP que desejam expressar seu conhecimento em frameworks modernos. Ideal para trabalho e eventos de tecnologia.',
    categoryId: category1.id,
    images: ['product_5_2.png'],
    metadataIds: ['php', 'laravel'],
  })
  await createProductWithMetadata({
    label: 'Camiseta Laravel - Branca',
    price: 60.0,
    description:
      'Camiseta branca com estampa Laravel, elegante e confortável, perfeita para programadores PHP que buscam unir estilo e tecnologia. Excelente para uso diário, cursos ou eventos de comunidade tech.',
    categoryId: category1.id,
    images: ['product_5_3.png'],
    metadataIds: ['php', 'laravel'],
  })
  await createProductWithMetadata({
    label: 'Camiseta Laravel - Preta',
    price: 59.9,
    description:
      'Camiseta preta com estampa Laravel, ideal para desenvolvedores PHP que valorizam conforto e estilo. Tecido macio e resistente, excelente para o dia a dia ou encontros de tecnologia.',
    categoryId: category1.id,
    images: ['product_5_4.png'],
    metadataIds: ['php', 'laravel'],
  })
  console.log('✅ Camisetas Laravel created')

  // Camisetas Web Base
  await createProductWithMetadata({
    label: 'Camiseta CSS Azul',
    price: 60.0,
    description:
      'Camiseta azul com design CSS, ideal para iniciantes e desenvolvedores que querem mostrar paixão pelo front-end. Confortável, leve e perfeita para estudo, trabalho ou eventos de tecnologia.',
    categoryId: category1.id,
    images: ['product_8_1.png'],
    metadataIds: ['css'],
  })
  await createProductWithMetadata({
    label: 'Camiseta JS Laranja',
    price: 49.9,
    description:
      'Camiseta laranja com design JavaScript, associando também a tecnologia React, perfeita para desenvolvedores front-end que querem unir aprendizado e estilo no dia a dia.',
    categoryId: category1.id,
    images: ['product_8_2.png'],
    metadataIds: ['javascript', 'react'],
  })
  await createProductWithMetadata({
    label: 'Camiseta HTML Amarela',
    price: 49.9,
    description:
      'Camiseta amarela com design HTML, ideal para estudantes e desenvolvedores que desejam praticidade, conforto e expressar interesse por tecnologias essenciais do front-end.',
    categoryId: category1.id,
    images: ['product_8_3.png'],
    metadataIds: ['html'],
  })
  console.log('✅ Camisetas Web Base created')

  // Bonés Escuros
  await createProductWithMetadata({
    label: 'Boné B7Web - Azul',
    price: 39.9,
    description:
      'Boné B7Web azul escuro, perfeito para proteção solar com estilo casual e moderno.',
    categoryId: category2.id,
    images: ['product_6_1.png'],
    metadataIds: ['azul'],
  })
  await createProductWithMetadata({
    label: 'Boné B7Web - Preto',
    price: 39.9,
    description:
      'Boné B7Web preto, confortável e estiloso, ideal para uso diário.',
    categoryId: category2.id,
    images: ['product_6_2.png'],
    metadataIds: ['preto'],
  })
  await createProductWithMetadata({
    label: 'Boné B7Web - Cinza Escuro',
    price: 39.9,
    description:
      'Boné B7Web cinza escuro, leve e durável, perfeito para qualquer ocasião casual.',
    categoryId: category2.id,
    images: ['product_6_3.png'],
    metadataIds: ['cinza-escuro'],
  })
  console.log('✅ Bonés Escuros created')

  // Bonés Claros
  await createProductWithMetadata({
    label: 'Boné B7Web - Azul Claro',
    price: 29.9,
    description:
      'Boné B7Web azul claro, confortável e leve, ideal para estilo casual.',
    categoryId: category2.id,
    images: ['product_7_1.png'],
    metadataIds: ['azul-claro'],
  })
  await createProductWithMetadata({
    label: 'Boné B7Web - Cinza Claro',
    price: 29.9,
    description:
      'Boné B7Web cinza claro, estiloso e confortável, perfeito para o dia a dia.',
    categoryId: category2.id,
    images: ['product_7_2.png'],
    metadataIds: ['cinza-claro'],
  })
  await createProductWithMetadata({
    label: 'Boné B7Web - Branco',
    price: 29.9,
    description:
      'Boné B7Web branco, clássico e leve, ideal para qualquer ocasião.',
    categoryId: category2.id,
    images: ['product_7_3.png'],
    metadataIds: ['branco'],
  })
  console.log('✅ Bonés Claros created')

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
