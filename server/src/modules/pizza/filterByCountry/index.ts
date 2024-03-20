import { Pizza } from '@server/entities/pizza'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

export default authenticatedProcedure
  .input(z.object({ name: z.string() }))
  .query(async ({ input, ctx: { db } }) => {
    const { name } = input

    const pizzas = await db.getRepository(Pizza).find({
      where: {
        brand: {
          country: {
            name,
          },
        },
      },
      relations: ['user', 'brand', 'images', 'brand.country', 'brand.pizzas'],
    })
    if (!pizzas) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Pizza was not found`,
      })
    }

    return pizzas
  })
