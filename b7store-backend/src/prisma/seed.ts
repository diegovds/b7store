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

  // Categorias
  const category1 = await prisma.category.create({
    data: { slug: 'camisetas', name: 'Camisetas' },
  })
  const category2 = await prisma.category.create({
    data: { slug: 'bones', name: 'Bonés' },
  })

  // Category Metadata
  const techMetadata = await prisma.categoryMetadata.create({
    data: { id: 'tech', name: 'Tecnologia', categoryId: category1.id },
  })

  const colorMetadata = await prisma.categoryMetadata.create({
    data: { id: 'color', name: 'Cor', categoryId: category2.id },
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
  console.log('✅ Banners created')

  // Metadata Values Tech
  await Promise.all([
    prisma.metadataValue.create({
      data: { id: 'node', label: 'Node', categoryMetadataId: techMetadata.id },
    }),
    prisma.metadataValue.create({
      data: {
        id: 'react',
        label: 'React',
        categoryMetadataId: techMetadata.id,
      },
    }),
    prisma.metadataValue.create({
      data: { id: 'php', label: 'PHP', categoryMetadataId: techMetadata.id },
    }),
    prisma.metadataValue.create({
      data: {
        id: 'react-native',
        label: 'React Native',
        categoryMetadataId: techMetadata.id,
      },
    }),
    prisma.metadataValue.create({
      data: {
        id: 'laravel',
        label: 'Laravel',
        categoryMetadataId: techMetadata.id,
      },
    }),
    prisma.metadataValue.create({
      data: { id: 'css', label: 'CSS', categoryMetadataId: techMetadata.id },
    }),
    prisma.metadataValue.create({
      data: {
        id: 'javascript',
        label: 'JavaScript',
        categoryMetadataId: techMetadata.id,
      },
    }),
    prisma.metadataValue.create({
      data: { id: 'html', label: 'HTML', categoryMetadataId: techMetadata.id },
    }),
  ])
  console.log('✅ Metadata values (tech) created')

  // Metadata Values Color
  await Promise.all([
    prisma.metadataValue.create({
      data: { id: 'blue', label: 'Azul', categoryMetadataId: colorMetadata.id },
    }),
    prisma.metadataValue.create({
      data: {
        id: 'black',
        label: 'Preto',
        categoryMetadataId: colorMetadata.id,
      },
    }),
    prisma.metadataValue.create({
      data: {
        id: 'dark-gray',
        label: 'Cinza Escuro',
        categoryMetadataId: colorMetadata.id,
      },
    }),
    prisma.metadataValue.create({
      data: {
        id: 'light-gray',
        label: 'Cinza Claro',
        categoryMetadataId: colorMetadata.id,
      },
    }),
    prisma.metadataValue.create({
      data: {
        id: 'white',
        label: 'Branco',
        categoryMetadataId: colorMetadata.id,
      },
    }),
  ])
  console.log('✅ Metadata values (color) created')

  // Função de criação de produto com múltiplos metadados
  async function createProductWithMetadata(data: {
    label: string
    price: number
    description: string
    categoryId: number
    images: string[]
    metadataIds?: Record<string, string[]>
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

    if (data.metadataIds) {
      for (const categoryMetadataId in data.metadataIds) {
        const valueIds = data.metadataIds[categoryMetadataId]
        for (const metadataValueId of valueIds) {
          await prisma.productMetadata.create({
            data: {
              productId: product.id,
              categoryMetadataId,
              metadataValueId,
            },
          })
        }
      }
    }
  }

  // === Camisetas ===
  // React
  await createProductWithMetadata({
    label: 'Camiseta React - Azul',
    price: 94.5,
    description:
      'Camiseta de alta qualidade com logo do React em destaque na cor azul. Confeccionada com tecido confortável e resistente, perfeita para uso diário ou eventos de tecnologia.',
    categoryId: category1.id,
    images: ['product_1_1.png'],
    metadataIds: { tech: ['react'] },
  })
  await createProductWithMetadata({
    label: 'Camiseta React - Cinza',
    price: 94.5,
    description:
      'Camiseta de alta qualidade com logo do React na cor cinza. Estilo moderno e confortável, ideal para programadores e amantes de tecnologia.',
    categoryId: category1.id,
    images: ['product_1_2.png'],
    metadataIds: { tech: ['react'] },
  })
  await createProductWithMetadata({
    label: 'Camiseta React - Preta',
    price: 94.5,
    description:
      'Camiseta elegante e confortável com logo do React na cor preta. Excelente para eventos de tecnologia ou uso diário com estilo moderno.',
    categoryId: category1.id,
    images: ['product_1_3.png'],
    metadataIds: { tech: ['react'] },
  })

  // React Native
  await createProductWithMetadata({
    label: 'Camiseta React Native - Azul Escuro',
    price: 89.9,
    description:
      'Camiseta exclusiva com estampa React Native em azul escuro, tecido de alta qualidade, ideal para desenvolvedores mobile que buscam conforto e estilo.',
    categoryId: category1.id,
    images: ['product_2_1.png'],
    metadataIds: { tech: ['react', 'react-native'] },
  })

  // PHP
  await createProductWithMetadata({
    label: 'Camiseta PHP - Azul',
    price: 60.0,
    description:
      'Camiseta confortável com estampa PHP na cor azul. Tecido macio e durável, perfeita para programadores PHP ou eventos de tecnologia.',
    categoryId: category1.id,
    images: ['product_3_1.png'],
    metadataIds: { tech: ['php'] },
  })
  await createProductWithMetadata({
    label: 'Camiseta PHP - Cinza',
    price: 69.9,
    description:
      'Camiseta macia e resistente com estampa PHP cinza. Ideal para uso diário e eventos de tecnologia.',
    categoryId: category1.id,
    images: ['product_3_2.png'],
    metadataIds: { tech: ['php'] },
  })

  // Node.js
  await createProductWithMetadata({
    label: 'Camiseta Node.js - Verde',
    price: 60.0,
    description:
      'Camiseta moderna com estampa Node.js verde, perfeita para desenvolvedores backend. Confortável e durável, ideal para uso diário.',
    categoryId: category1.id,
    images: ['product_4_1.png'],
    metadataIds: { tech: ['node', 'javascript'] },
  })
  await createProductWithMetadata({
    label: 'Camiseta Node.js - Preta',
    price: 79.9,
    description:
      'Camiseta preta confortável com estampa Node.js. Material de qualidade, ideal para desenvolvedores e eventos tecnológicos.',
    categoryId: category1.id,
    images: ['product_4_2.png'],
    metadataIds: { tech: ['node', 'javascript'] },
  })

  // Laravel
  await createProductWithMetadata({
    label: 'Camiseta Laravel - Vermelha',
    price: 60.0,
    description:
      'Camiseta vermelha com estampa Laravel. Tecido confortável e resistente, ideal para desenvolvedores backend e eventos de tecnologia.',
    categoryId: category1.id,
    images: ['product_5_1.png'],
    metadataIds: { tech: ['php', 'laravel'] },
  })
  await createProductWithMetadata({
    label: 'Camiseta Laravel - Azul',
    price: 59.9,
    description:
      'Camiseta azul com estampa Laravel. Estilo moderno e confortável, perfeita para programadores Laravel.',
    categoryId: category1.id,
    images: ['product_5_2.png'],
    metadataIds: { tech: ['php', 'laravel'] },
  })
  await createProductWithMetadata({
    label: 'Camiseta Laravel - Branca',
    price: 60.0,
    description:
      'Camiseta branca com estampa Laravel. Tecido de qualidade e ajuste perfeito, ideal para uso diário.',
    categoryId: category1.id,
    images: ['product_5_3.png'],
    metadataIds: { tech: ['php', 'laravel'] },
  })
  await createProductWithMetadata({
    label: 'Camiseta Laravel - Preta',
    price: 59.9,
    description:
      'Camiseta preta com estampa Laravel. Material resistente, confortável e ideal para desenvolvedores.',
    categoryId: category1.id,
    images: ['product_5_4.png'],
    metadataIds: { tech: ['php', 'laravel'] },
  })

  // Web Base (CSS, JS, HTML)
  await createProductWithMetadata({
    label: 'Camiseta CSS Azul',
    price: 60.0,
    description:
      'Camiseta azul com design CSS. Confortável e estilosa, perfeita para desenvolvedores frontend.',
    categoryId: category1.id,
    images: ['product_8_1.png'],
    metadataIds: { tech: ['css'] },
  })
  await createProductWithMetadata({
    label: 'Camiseta JS Amarela',
    price: 49.9,
    description:
      'Camiseta amarela com design JavaScript. Material confortável e resistente, ideal para programadores frontend.',
    categoryId: category1.id,
    images: ['product_8_3.png'],
    metadataIds: { tech: ['javascript', 'react'] },
  })
  await createProductWithMetadata({
    label: 'Camiseta HTML Laranja',
    price: 49.9,
    description:
      'Camiseta laranja com design HTML. Confortável, resistente e perfeita para desenvolvedores frontend.',
    categoryId: category1.id,
    images: ['product_8_2.png'],
    metadataIds: { tech: ['html'] },
  })

  // === Bonés ===
  await createProductWithMetadata({
    label: 'Boné B7Web - Azul',
    price: 39.9,
    description:
      'Boné B7Web azul escuro, perfeito para proteção solar com estilo casual. Material leve e confortável, ideal para passeios, esportes e uso diário. Design moderno e resistente, garantindo durabilidade e conforto.',
    categoryId: category2.id,
    images: ['product_6_1.png'],
    metadataIds: { color: ['blue'] },
  })
  await createProductWithMetadata({
    label: 'Boné B7Web - Preto',
    price: 39.9,
    description:
      'Boné B7Web preto, confortável e estiloso. Produzido com materiais de qualidade, proporciona ajuste seguro e toque suave. Perfeito para looks urbanos e atividades ao ar livre, unindo praticidade e estilo.',
    categoryId: category2.id,
    images: ['product_6_2.png'],
    metadataIds: { color: ['black'] },
  })
  await createProductWithMetadata({
    label: 'Boné B7Web - Cinza Escuro',
    price: 39.9,
    description:
      'Boné B7Web cinza escuro, leve e durável. Design moderno, perfeito para quem busca conforto e estilo em atividades externas ou no dia a dia. Ajuste confortável e material resistente garantem longa durabilidade.',
    categoryId: category2.id,
    images: ['product_6_3.png'],
    metadataIds: { color: ['dark-gray'] },
  })
  await createProductWithMetadata({
    label: 'Boné B7Web - Azul Claro',
    price: 29.9,
    description:
      'Boné B7Web azul claro, confortável e leve. Ideal para proteção solar com estilo casual. Material resistente, design moderno e ajuste confortável para uso diário.',
    categoryId: category2.id,
    images: ['product_7_1.png'],
    metadataIds: { color: ['blue'] },
  })
  await createProductWithMetadata({
    label: 'Boné B7Web - Cinza Claro',
    price: 29.9,
    description:
      'Boné B7Web cinza claro, estiloso e confortável. Produzido com materiais de qualidade, garantindo ajuste perfeito e durabilidade. Perfeito para atividades ao ar livre ou uso diário.',
    categoryId: category2.id,
    images: ['product_7_2.png'],
    metadataIds: { color: ['light-gray'] },
  })
  await createProductWithMetadata({
    label: 'Boné B7Web - Branco',
    price: 29.9,
    description:
      'Boné B7Web branco, clássico e leve. Confortável para uso diário, perfeito para complementar looks casuais ou esportivos. Material resistente e design moderno, garantindo durabilidade e estilo.',
    categoryId: category2.id,
    images: ['product_7_3.png'],
    metadataIds: { color: ['white'] },
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
