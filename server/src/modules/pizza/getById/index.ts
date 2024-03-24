import { Pizza } from '@server/entities/pizza'
import { publicProcedure } from '@server/trpc'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

export default publicProcedure
  .input(z.number())
  .query(async ({ input, ctx: { db } }) => {
    const pizza = await db.getRepository(Pizza).findOne({
      where: { id: Number(input) },
      relations: ['user', 'brand', 'images'],
    })
    if (!pizza) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Pizza was not found`,
      })
    }
    return pizza
  })
