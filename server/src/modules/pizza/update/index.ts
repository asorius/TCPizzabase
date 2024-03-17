import { Image } from '@server/entities'
import { Pizza, pizzaSchema } from '@server/entities/pizza'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

export default authenticatedProcedure
  .input(z.object({ pizzaId: pizzaSchema.shape.id, imageUrl: z.string() }))
  .query(async ({ input, ctx: { db } }) => {
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
    const newImage = new Image()
    newImage.rating = 5
    newImage.source = input.imageUrl
    newImage.user = pizza.user
    pizza.images = [newImage]

    return db.getRepository(Pizza).save(pizza)
  })
