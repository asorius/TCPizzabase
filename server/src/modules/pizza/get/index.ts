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
    })
  )
  .query(async ({ input, ctx: { db } }) => {
    if (input.brand && input.country) {
      const { brand, country } = input
      return getByBoth({ brand, country, db })
    }
    if (input.country) {
      const name = input.country as string

      return getByCountry({ name, db })
    }
    if (input.brand) {
      const title = input.brand as string
      return getByBrand({ title, db })
    }
    const pizzas = await db.getRepository(Pizza).find({
      relations: ['user', 'brand', 'images'],
    })
    return pizzas
  })
