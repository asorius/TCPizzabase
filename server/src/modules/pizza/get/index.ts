import { Pizza, pizzaSchema, type PizzaBare } from '@server/entities/pizza'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import { TRPCError } from '@trpc/server'

export default authenticatedProcedure
  .input(pizzaSchema.shape.id)
  .query(async ({ input: pizzaId, ctx: { authUser, db } }) => {
    // Unfortunately TypeORM does not present correct types
    // for selected relations. We add a type assertion here.
    const pizza = (await db.getRepository(Pizza).findOne({
      where: { id: pizzaId },
    })) as PizzaBare

    if (!pizza) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `pizza was not found`,
      })
    }

    // We could also require user to specify their id in the query
    // and then perform a where: { id: pizzaId, userId: authUser.id }
    // query.
    if (pizza.user.id !== authUser.id) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: `You are not allowed to access this pizza.`,
      })
    }

    return pizza
  })
