import { Image } from '@server/entities'
import { Pizza, pizzaSchema } from '@server/entities/pizza'
import { User, userSchema } from '@server/entities/user'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

export default authenticatedProcedure
  .input(
    z.object({
      pizzaId: pizzaSchema.shape.id,
      userId: userSchema.shape.id,
      imageUrl: z.string(),
      imagePath: z.string(),
      rating: z.number(),
    })
  )
  .mutation(async ({ input, ctx: { db } }) => {
    const pizza = await db.getRepository(Pizza).findOne({
      where: { id: input.pizzaId },
      relations: ['user', 'brand', 'images'],
    })
    const user = await db.getRepository(User).findOne({
      where: { id: input.userId },
    })

    if (!pizza) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Pizza was not found`,
      })
    }
    if (!user) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `User was not found`,
      })
    }
    const newImage = new Image()
    newImage.rating = input.rating
    newImage.source = input.imageUrl
    newImage.user = user
    newImage.path = input.imagePath

    pizza.images = [...pizza.images, newImage]

    return db.getRepository(Pizza).save(pizza)
  })
