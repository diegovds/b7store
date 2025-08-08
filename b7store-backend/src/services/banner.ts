import { db } from '../drizzle/drizzle'

export const getAllBanners = async () => {
  const banners = await db.query.banners.findMany({
    columns: {
      img: true,
      link: true,
    },
  })

  return banners.map((banner) => ({
    ...banner,
    img: `media/banners/${banner.img}`,
  }))
}
