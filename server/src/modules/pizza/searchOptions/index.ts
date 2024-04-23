import { TRPCError } from '@trpc/server'
import { publicProcedure } from '@server/trpc'
import { Brand, Country } from '@server/entities'

export default publicProcedure.query(async ({ ctx: { db } }) => {
  const brands = await db
    .getRepository(Brand)
    .createQueryBuilder('brand')
    .distinctOn(['brand.title'])
    .select('brand.title')
    .getRawMany()

  const countries = await db
    .getRepository(Country)
    .createQueryBuilder('country')
    .distinctOn(['country.name'])
    .getRawMany()
  return {
    countries: countries.map((country) => country.name),
    brands: brands.map((brand) => brand.title),
  }
})
