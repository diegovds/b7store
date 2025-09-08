type SearchPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const search = await searchParams

  return <div>Busca por {search.q}:</div>
}
