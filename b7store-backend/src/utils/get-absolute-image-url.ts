import { env } from '../env'

export const getAbsoluteImageUrl = (path: string) => {
  return `${env.BASE_URL}/${path}`
}
