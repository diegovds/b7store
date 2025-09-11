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

  // Category Metadata
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
  console.log('✅ Banners created')

  // Metadata Values
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

  // Function to create product with images and metadata
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

  // Products

  // Camisetas React
  await createProductWithMetadata({
    label: 'Camiseta React - Azul',
    price: 94.5,
    description:
      'Camiseta de alta qualidade com logo do React em destaque na cor azul. Confeccionada em algodão premium, oferece extremo conforto e durabilidade. Ideal para desenvolvedores e entusiastas de tecnologia, combina estilo moderno com toque macio, perfeita para uso diário ou eventos de tecnologia.',
    categoryId: category1.id,
    images: ['product_1_1.png'],
    metadataIds: ['react'],
  })
  await createProductWithMetadata({
    label: 'Camiseta React - Cinza',
    price: 94.5,
    description:
      'Camiseta cinza com estampa do React. Produzida com algodão macio e resistente, garantindo conforto durante todo o dia. Design moderno e minimalista que combina com qualquer look casual ou geek, ideal para programadores que desejam mostrar seu amor pelo React com estilo.',
    categoryId: category1.id,
    images: ['product_1_2.png'],
    metadataIds: ['react'],
  })
  await createProductWithMetadata({
    label: 'Camiseta React - Preta',
    price: 94.5,
    description:
      'Camiseta preta com estampa React. Confeccionada em algodão premium, confortável e durável. Perfeita para quem deseja unir tecnologia e moda, oferecendo visual moderno para o dia a dia ou encontros com amigos e eventos de tecnologia.',
    categoryId: category1.id,
    images: ['product_1_3.png'],
    metadataIds: ['react'],
  })

  // Camisetas React Native
  await createProductWithMetadata({
    label: 'Camiseta React Native - Azul Escuro',
    price: 89.9,
    description:
      'Camiseta exclusiva com estampa React Native em azul escuro. Algodão 100% premium com toque suave e confortável. Ideal para desenvolvedores mobile que querem expressar estilo e paixão pelo React Native, combinando qualidade, durabilidade e design moderno.',
    categoryId: category1.id,
    images: ['product_2_1.png'],
    metadataIds: ['react', 'react-native'],
  })

  // Camisetas PHP
  await createProductWithMetadata({
    label: 'Camiseta PHP - Azul',
    price: 60.0,
    description:
      'Camiseta confortável com estampa PHP em azul. Feita com algodão resistente, mantendo a forma e cor após várias lavagens. Ideal para programadores PHP que desejam unir conforto e estilo em suas roupas do dia a dia.',
    categoryId: category1.id,
    images: ['product_3_1.png'],
    metadataIds: ['php'],
  })
  await createProductWithMetadata({
    label: 'Camiseta PHP - Cinza',
    price: 69.9,
    description:
      'Camiseta cinza macia e resistente com estampa PHP. Confortável e estilosa, perfeita para programadores e entusiastas da linguagem que querem mostrar sua paixão de forma elegante e casual.',
    categoryId: category1.id,
    images: ['product_3_2.png'],
    metadataIds: ['php'],
  })

  // Camisetas Node.js
  await createProductWithMetadata({
    label: 'Camiseta Node.js - Verde',
    price: 60.0,
    description:
      'Camiseta verde com estampa Node.js. Feita em algodão de alta qualidade, combina conforto e durabilidade. Ideal para programadores Node.js e entusiastas de tecnologia que desejam unir estilo e funcionalidade em seu visual.',
    categoryId: category1.id,
    images: ['product_4_1.png'],
    metadataIds: ['node', 'javascript'],
  })
  await createProductWithMetadata({
    label: 'Camiseta Node.js - Preta',
    price: 79.9,
    description:
      'Camiseta preta confortável com estampa Node.js. Produzida com material premium, oferecendo toque suave e resistência. Excelente para uso diário ou eventos de tecnologia, garantindo estilo e identificação com a comunidade Node.js.',
    categoryId: category1.id,
    images: ['product_4_2.png'],
    metadataIds: ['node', 'javascript'],
  })

  // Camisetas Laravel
  await createProductWithMetadata({
    label: 'Camiseta Laravel - Vermelha',
    price: 60.0,
    description:
      'Camiseta vermelha com estampa Laravel. Algodão premium confortável, ideal para desenvolvedores que desejam unir estilo e paixão pelo Laravel. Design moderno e resistente, perfeita para uso diário e eventos tecnológicos.',
    categoryId: category1.id,
    images: ['product_5_1.png'],
    metadataIds: ['php', 'laravel'],
  })
  await createProductWithMetadata({
    label: 'Camiseta Laravel - Azul',
    price: 59.9,
    description:
      'Camiseta azul com estampa Laravel. Material de alta qualidade, confortável e durável. Excelente escolha para programadores que buscam unir conforto, estilo e identificação com a comunidade Laravel.',
    categoryId: category1.id,
    images: ['product_5_2.png'],
    metadataIds: ['php', 'laravel'],
  })
  await createProductWithMetadata({
    label: 'Camiseta Laravel - Branca',
    price: 60.0,
    description:
      'Camiseta branca com estampa Laravel. Feita em algodão premium, macia e confortável. Ideal para uso casual e eventos de tecnologia, mostrando sua paixão pelo Laravel de forma elegante.',
    categoryId: category1.id,
    images: ['product_5_3.png'],
    metadataIds: ['php', 'laravel'],
  })
  await createProductWithMetadata({
    label: 'Camiseta Laravel - Preta',
    price: 59.9,
    description:
      'Camiseta preta com estampa Laravel. Confortável e durável, confeccionada com algodão de alta qualidade. Ideal para desenvolvedores que desejam unir estilo, conforto e identificação com a comunidade Laravel.',
    categoryId: category1.id,
    images: ['product_5_4.png'],
    metadataIds: ['php', 'laravel'],
  })

  // Camisetas Web Base
  await createProductWithMetadata({
    label: 'Camiseta CSS Azul',
    price: 60.0,
    description:
      'Camiseta azul com design CSS. Confeccionada em algodão premium, confortável e durável. Perfeita para designers e desenvolvedores que querem mostrar sua afinidade com CSS de forma estilosa e casual.',
    categoryId: category1.id,
    images: ['product_8_1.png'],
    metadataIds: ['css'],
  })
  await createProductWithMetadata({
    label: 'Camiseta JS Amarela',
    price: 49.9,
    description:
      'Camiseta amarela com design JavaScript. Algodão macio e confortável, ideal para programadores e entusiastas que querem destacar sua paixão pelo JS com estilo e personalidade.',
    categoryId: category1.id,
    images: ['product_8_3.png'],
    metadataIds: ['javascript', 'react'],
  })
  await createProductWithMetadata({
    label: 'Camiseta HTML Laranja',
    price: 49.9,
    description:
      'Camiseta laranja com design HTML. Material confortável, resistente e macio. Ideal para profissionais de tecnologia ou estudantes que desejam unir estilo e paixão por HTML em um look moderno.',
    categoryId: category1.id,
    images: ['product_8_2.png'],
    metadataIds: ['html'],
  })

  // Bonés Escuros
  await createProductWithMetadata({
    label: 'Boné B7Web - Azul',
    price: 39.9,
    description:
      'Boné B7Web azul escuro, perfeito para proteção solar com estilo casual. Material leve e confortável, ideal para passeios, esportes e uso diário. Design moderno e resistente, garantindo durabilidade e conforto.',
    categoryId: category2.id,
    images: ['product_6_1.png'],
  })
  await createProductWithMetadata({
    label: 'Boné B7Web - Preto',
    price: 39.9,
    description:
      'Boné B7Web preto, confortável e estiloso. Produzido com materiais de qualidade, proporciona ajuste seguro e toque suave. Perfeito para looks urbanos e atividades ao ar livre, unindo praticidade e estilo.',
    categoryId: category2.id,
    images: ['product_6_2.png'],
  })
  await createProductWithMetadata({
    label: 'Boné B7Web - Cinza Escuro',
    price: 39.9,
    description:
      'Boné B7Web cinza escuro, leve e durável. Design moderno, perfeito para quem busca conforto e estilo em atividades externas ou no dia a dia. Ajuste confortável e material resistente garantem longa durabilidade.',
    categoryId: category2.id,
    images: ['product_6_3.png'],
  })

  // Bonés Claros
  await createProductWithMetadata({
    label: 'Boné B7Web - Azul Claro',
    price: 29.9,
    description:
      'Boné B7Web azul claro, confortável e leve. Ideal para proteção solar com estilo casual. Material resistente, design moderno e ajuste confortável para uso diário.',
    categoryId: category2.id,
    images: ['product_7_1.png'],
  })
  await createProductWithMetadata({
    label: 'Boné B7Web - Cinza Claro',
    price: 29.9,
    description:
      'Boné B7Web cinza claro, estiloso e confortável. Produzido com materiais de qualidade, garantindo ajuste perfeito e durabilidade. Perfeito para atividades ao ar livre ou uso diário.',
    categoryId: category2.id,
    images: ['product_7_2.png'],
  })
  await createProductWithMetadata({
    label: 'Boné B7Web - Branco',
    price: 29.9,
    description:
      'Boné B7Web branco, clássico e leve. Confortável para uso diário, perfeito para complementar looks casuais ou esportivos. Material resistente e design moderno, garantindo durabilidade e estilo.',
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
