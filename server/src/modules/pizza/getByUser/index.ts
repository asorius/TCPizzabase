import { Pizza, type PizzaBare } from '@server/entities/pizza'
import { userSchema } from '@server/entities/user'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'

export default authenticatedProcedure
  .input(userSchema.shape.id)
  .query(async ({ input: userId, ctx: { db } }) => {
    const pizzas = (await db.getRepository(Pizza).find({
      where: { user: { id: userId } },
      relations: ['user', 'brand', 'images'],
    })) as PizzaBare[]

    return pizzas
  })
