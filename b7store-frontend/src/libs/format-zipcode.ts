export const formatZipcode = (zipcode: string) => {
  const onlyNumbers = zipcode.replace(/\D/g, '')

  if (onlyNumbers.length === 8) {
    return onlyNumbers.replace(/(\d{5})(\d{3})/, '$1-$2')
  }

  return zipcode
}
