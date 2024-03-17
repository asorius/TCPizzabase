import { Pizza } from '@server/entities/pizza'
import { publicProcedure } from '@server/trpc'

export default publicProcedure.query(async ({ ctx: { db } }) => {
  const pizzas = await db.getRepository(Pizza).find({
    relations: ['user', 'brand', 'images'],
  })

  return pizzas
})
