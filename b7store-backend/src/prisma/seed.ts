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

  // ===================== CATEGORIAS =====================
  const categoryCamisetas = await prisma.category.create({
    data: { slug: 'camisetas', name: 'Camisetas' },
  })

  const categoryBones = await prisma.category.create({
    data: { slug: 'bones', name: 'Bonés' },
  })

  // ===================== METADATA =====================
  // Tech metadata para camisetas
  const techMetadata = await prisma.categoryMetadata.create({
    data: { id: 'tech', name: 'Tecnologia', categoryId: categoryCamisetas.id },
  })

  // Color metadata global
  const colorMetadata = await prisma.categoryMetadata.create({
    data: { id: 'color', name: 'Cor' },
  })

  // Valores de tech
  const techValues = [
    { id: 'react', label: 'React' },
    { id: 'react-native', label: 'React Native' },
    { id: 'php', label: 'PHP' },
    { id: 'node', label: 'Node' },
    { id: 'javascript', label: 'JavaScript' },
    { id: 'laravel', label: 'Laravel' },
    { id: 'css', label: 'CSS' },
    { id: 'html', label: 'HTML' },
  ]

  await Promise.all(
    techValues.map((val) =>
      prisma.metadataValue.create({
        data: { ...val, categoryMetadataId: techMetadata.id },
      }),
    ),
  )

  // Valores de cor
  const colorValues = [
    { id: 'blue', label: 'Azul' },
    { id: 'black', label: 'Preto' },
    { id: 'white', label: 'Branco' },
    { id: 'gray', label: 'Cinza' },
    { id: 'green', label: 'Verde' },
    { id: 'red', label: 'Vermelho' },
    { id: 'yellow', label: 'Amarelo' },
    { id: 'orange', label: 'Laranja' },
    { id: 'darkgray', label: 'Cinza Escuro' },
    { id: 'lightgray', label: 'Cinza Claro' },
    { id: 'lightblue', label: 'Azul Claro' },
  ]

  await Promise.all(
    colorValues.map((val) =>
      prisma.metadataValue.create({
        data: { ...val, categoryMetadataId: colorMetadata.id },
      }),
    ),
  )

  // ===================== BANNERS =====================
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

  // ===================== FUNÇÃO AUXILIAR =====================
  async function createProductWithMetadata(data: {
    label: string
    price: number
    description: string
    categoryId: number
    images: string[]
    metadataIds?: Record<string, string[]> // { tech: ['react'], color: ['blue'] }
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
      for (const metadataIdKey in data.metadataIds) {
        const valueIds = data.metadataIds[metadataIdKey]
        for (const valueId of valueIds) {
          const metadata =
            metadataIdKey === 'tech' ? techMetadata : colorMetadata
          await prisma.productMetadata.create({
            data: {
              productId: product.id,
              categoryMetadataId: metadata.id,
              metadataValueId: valueId,
            },
          })
        }
      }
    }
  }

  // ===================== PRODUTOS CAMISETAS =====================
  const camisetas = [
    {
      label: 'Camiseta React - Azul',
      price: 94.5,
      description:
        'Camiseta de alta qualidade com estampa do logo React em azul vibrante. Confeccionada com algodão premium, garante conforto e durabilidade. Ideal para desenvolvedores e fãs de tecnologia que querem exibir seu estilo de maneira elegante e casual. Costura reforçada, toque macio e design moderno, perfeito para o dia a dia ou eventos de tecnologia.',
      images: ['product_1_1.png'],
      metadataIds: { tech: ['react'], color: ['blue'] },
    },
    {
      label: 'Camiseta React - Cinza',
      price: 94.5,
      description:
        'Camiseta cinza com estampa do React, confortável e resistente. Ideal para programadores que buscam uma peça casual, elegante e que combina com diferentes estilos. Algodão respirável e costura de qualidade para uso prolongado.',
      images: ['product_1_2.png'],
      metadataIds: { tech: ['react'], color: ['gray'] },
    },
    {
      label: 'Camiseta React - Preta',
      price: 94.5,
      description:
        'Camiseta preta com estampa React, minimalista e sofisticada. Produzida em algodão de alta qualidade, oferece durabilidade, conforto e estilo, ideal para uso diário ou eventos de tecnologia.',
      images: ['product_1_3.png'],
      metadataIds: { tech: ['react'], color: ['black'] },
    },
    {
      label: 'Camiseta React Native - Azul Escuro',
      price: 89.9,
      description:
        'Camiseta exclusiva com estampa React Native em azul escuro, ideal para desenvolvedores que trabalham com mobile. Algodão premium, confortável, respirável e resistente, perfeita para o dia a dia.',
      images: ['product_2_1.png'],
      metadataIds: { tech: ['react-native'], color: ['blue'] },
    },
    {
      label: 'Camiseta PHP - Azul',
      price: 60.0,
      description:
        'Camiseta confortável com estampa PHP azul, perfeita para quem quer exibir sua paixão por programação. Algodão macio, toque agradável, resistente e ideal para uso diário ou eventos de tecnologia.',
      images: ['product_3_1.png'],
      metadataIds: { tech: ['php'], color: ['blue'] },
    },
    {
      label: 'Camiseta PHP - Cinza',
      price: 69.9,
      description:
        'Camiseta PHP em cinza, de alta qualidade, confortável e resistente. Design moderno e versátil, ideal para programadores e eventos tecnológicos.',
      images: ['product_3_2.png'],
      metadataIds: { tech: ['php'], color: ['gray'] },
    },
    {
      label: 'Camiseta Node.js - Verde',
      price: 60.0,
      description:
        'Camiseta Node.js verde, moderna e confortável. Estampa destacada para desenvolvedores que desejam mostrar seu amor por tecnologia. Algodão premium, costura reforçada e design atraente.',
      images: ['product_4_1.png'],
      metadataIds: { tech: ['node', 'javascript'], color: ['green'] },
    },
    {
      label: 'Camiseta Node.js - Preta',
      price: 79.9,
      description:
        'Camiseta preta Node.js, resistente e elegante, com estampa destacada. Ideal para programadores que buscam conforto e estilo para o dia a dia.',
      images: ['product_4_2.png'],
      metadataIds: { tech: ['node', 'javascript'], color: ['black'] },
    },
    {
      label: 'Camiseta Laravel - Vermelha',
      price: 60.0,
      description:
        'Camiseta Laravel vermelha, com estampa sofisticada. Algodão de alta qualidade, confortável e durável. Ideal para eventos de tecnologia e uso casual.',
      images: ['product_5_1.png'],
      metadataIds: { tech: ['php', 'laravel'], color: ['red'] },
    },
    {
      label: 'Camiseta Laravel - Azul',
      price: 59.9,
      description:
        'Camiseta Laravel azul, confortável, moderna e durável. Estampa de alta qualidade, perfeita para desenvolvedores e eventos tecnológicos.',
      images: ['product_5_2.png'],
      metadataIds: { tech: ['php', 'laravel'], color: ['blue'] },
    },
    {
      label: 'Camiseta Laravel - Branca',
      price: 60.0,
      description:
        'Camiseta Laravel branca, minimalista e elegante. Produzida em algodão premium, confortável e resistente. Ideal para uso diário ou eventos de tecnologia.',
      images: ['product_5_3.png'],
      metadataIds: { tech: ['php', 'laravel'], color: ['white'] },
    },
    {
      label: 'Camiseta Laravel - Preta',
      price: 59.9,
      description:
        'Camiseta preta Laravel, elegante e confortável. Estampa de alta qualidade, resistente e perfeita para desenvolvedores.',
      images: ['product_5_4.png'],
      metadataIds: { tech: ['php', 'laravel'], color: ['black'] },
    },
    {
      label: 'Camiseta Web Base - CSS Azul',
      price: 49.9,
      description:
        'Camiseta Web Base com estampa CSS azul, confortável e moderna. Algodão premium, perfeita para designers e desenvolvedores que querem mostrar seu estilo.',
      images: ['product_8_1.png'],
      metadataIds: { tech: ['css'], color: ['blue'] },
    },
    {
      label: 'Camiseta Web Base - JavaScript Amarela',
      price: 49.9,
      description:
        'Camiseta Web Base com estampa JavaScript amarela, estilosa e confortável. Algodão de qualidade, ideal para programadores e fãs de tecnologia.',
      images: ['product_8_3.png'],
      metadataIds: { tech: ['javascript'], color: ['yellow'] },
    },
    {
      label: 'Camiseta Web Base - HTML Laranja',
      price: 49.9,
      description:
        'Camiseta Web Base com estampa HTML laranja, vibrante e confortável. Algodão premium, ideal para designers e desenvolvedores.',
      images: ['product_8_2.png'],
      metadataIds: { tech: ['html'], color: ['orange'] },
    },
  ]

  for (const prod of camisetas) {
    await createProductWithMetadata({
      ...prod,
      categoryId: categoryCamisetas.id,
    })
  }

  // ===================== PRODUTOS BONÉS =====================
  const bones = [
    {
      label: 'Boné B7Web - Azul Escuro',
      price: 39.9,
      description:
        'Boné B7Web azul escuro, feito com material leve e resistente, perfeito para proteção solar e estilo casual. Ajuste confortável que se adapta a diferentes tamanhos de cabeça.',
      images: ['product_6_1.png'],
      metadataIds: { color: ['blue'] },
    },
    {
      label: 'Boné B7Web - Preto',
      price: 39.9,
      description:
        'Boné B7Web preto clássico, leve e confortável, ideal para uso diário e atividades ao ar livre. Tecido respirável e durável.',
      images: ['product_6_2.png'],
      metadataIds: { color: ['black'] },
    },
    {
      label: 'Boné B7Web - Cinza Escuro',
      price: 39.9,
      description:
        'Boné B7Web cinza escuro, resistente e estiloso. Ideal para uso diário ou atividades ao ar livre.',
      images: ['product_6_3.png'],
      metadataIds: { color: ['darkgray'] },
    },
    {
      label: 'Boné B7Web - Azul Claro',
      price: 39.9,
      description:
        'Boné B7Web azul claro, leve e confortável, ideal para uso casual e proteção solar.',
      images: ['product_7_1.png'],
      metadataIds: { color: ['lightblue'] },
    },
    {
      label: 'Boné B7Web - Cinza Claro',
      price: 39.9,
      description:
        'Boné B7Web cinza claro, elegante e confortável, ideal para atividades diárias e lazer.',
      images: ['product_7_2.png'],
      metadataIds: { color: ['lightgray'] },
    },
    {
      label: 'Boné B7Web - Branco',
      price: 39.9,
      description:
        'Boné B7Web branco clássico, resistente e estiloso, perfeito para qualquer ocasião.',
      images: ['product_7_3.png'],
      metadataIds: { color: ['white'] },
    },
  ]

  for (const bone of bones) {
    await createProductWithMetadata({ ...bone, categoryId: categoryBones.id })
  }

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
