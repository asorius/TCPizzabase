import { Pizza } from '@server/entities/pizza'
import { publicProcedure } from '@server/trpc'
import { z } from 'zod'
import getByBrand from './byBrand'
import getByCountry from './byCountry'
import getByBoth from './byBoth'

export default publicProcedure
  .input(
    z.object({
      brand: z.string().default(''),
      country: z.string().default(''),
      page: z.number().default(0),
    })
  )
  .query(async ({ input, ctx: { db } }) => {
    const { brand, country, page } = input
    if (input.brand && input.country) {
      return getByBoth({ brand, country, db, page })
    }
    if (input.country) {
      const name = input.country as string

      return getByCountry({ name, db, page })
    }
    if (input.brand) {
      const title = input.brand as string
      return getByBrand({ title, db, page })
    }
    // No filter arguments, return full list
    const pizzas = await db.getRepository(Pizza).find({
      relations: ['user', 'brand', 'images', 'brand.country', 'brand.pizzas'],
      skip: page * 10,
      take: 10,
    })
    return pizzas
  })
