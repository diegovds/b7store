import { ProductListFilter } from '@/components/categories/product-list-filter'
import { getProducts } from '@/http/api'
import { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'

type SearchPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const search = await searchParams

  if (!search.q) {
    redirect('/')
  }

  return {
    title: `Busca por ${search.q}`,
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams

  const q = typeof params.q === 'string' ? params.q : undefined

  const order =
    params.order === 'views'
      ? 'views'
      : params.order === 'price'
        ? 'price'
        : params.order === 'selling'
          ? 'selling'
          : undefined

  const { q: _q, order: _order, ...filters } = params

  const { error, products } = await getProducts({
    orderBy: order,
    limit: '8',
    metadata: JSON.stringify(filters),
    q,
  })

  if (error) {
    redirect('/')
  }

  /*
    Detalhe: do jeito que está, se dois produtos tiverem a mesma categoryMetadata.id 
    mas com valores diferentes (ex: "Cor: Azul" e "Cor: Vermelho"), só o último valor vai ficar.
  */

  const metadata = Array.from(
    new Map(
      products
        .flatMap((p) => p.metadata)
        .map((m) => [
          m.metadataValue.categoryMetadata.id,
          {
            id: m.metadataValue.categoryMetadata.id,
            name: m.metadataValue.categoryMetadata.name,
            values: [
              {
                id: m.metadataValue.id,
                label: m.metadataValue.label,
              },
            ],
          },
        ]),
    ).values(),
  )

  return (
    <div>
      <div className="my-4 text-base text-gray-500">
        <Link href="/">Home</Link> &gt; Busca por {q}
      </div>
      <ProductListFilter products={products} metadata={metadata} />
    </div>
  )
}
