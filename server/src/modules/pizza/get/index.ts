import { Pizza, pizzaSchema, type PizzaBare } from '@server/entities/pizza'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import { TRPCError } from '@trpc/server'

export default authenticatedProcedure
  .input(pizzaSchema.shape.id)
  .query(async ({ input: pizzaId, ctx: { db } }) => {
    const pizza = (await db.getRepository(Pizza).findOne({
      where: { id: pizzaId },
    })) as PizzaBare

    if (!pizza) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `pizza was not found`,
      })
    }

    return pizza
  })
