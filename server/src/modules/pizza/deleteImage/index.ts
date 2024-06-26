import { Pizza, pizzaSchema } from '@server/entities/pizza'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

export default authenticatedProcedure
  .input(z.object({ pizzaId: pizzaSchema.shape.id, imageUrl: z.string() }))
  .mutation(async ({ input, ctx: { db } }) => {
    const pizza = await db.getRepository(Pizza).findOne({
      where: { id: input.pizzaId },
      relations: ['user', 'brand', 'images'],
    })
    if (!pizza) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Pizza was not found`,
      })
    }
    pizza.images = pizza.images.filter((image) => image.path !== input.imageUrl)
    const updatedPizza = await db.getRepository(Pizza).save(pizza)
    return updatedPizza
  })
