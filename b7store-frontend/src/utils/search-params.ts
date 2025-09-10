export function normalizeSearchParams(params: {
  [key: string]: string | string[] | undefined
}) {
  const normalized: { [key: string]: string | undefined } = {}
  for (const key in params) {
    const value = params[key]
    normalized[key] =
      typeof value === 'string'
        ? value
        : Array.isArray(value)
          ? value[0]
          : undefined
  }
  return normalized
}
