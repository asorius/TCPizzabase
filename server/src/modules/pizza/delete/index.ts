import { Pizza } from '@server/entities/pizza'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

export default authenticatedProcedure
  .input(z.number())
  .mutation(async ({ input, ctx: { db } }) => {
    const pizza = await db.getRepository(Pizza).findOne({
      where: { id: input },
    })
    if (!pizza) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Pizza was not found`,
      })
    }
    const deletedPizza = await db.getRepository(Pizza).remove(pizza)

    return deletedPizza
  })
