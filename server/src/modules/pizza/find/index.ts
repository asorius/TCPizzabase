import { Pizza, type PizzaBare } from '@server/entities/pizza'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'

export default authenticatedProcedure.query(
  async ({ ctx: { authUser, db } }) => {
    const userId = authUser.id
    const pizzas = (await db.getRepository(Pizza).find({
      where: {
        user: {
          id: userId,
        },
      },
      relations: ['user'],
      order: { id: 'ASC' },
    })) as PizzaBare[]

    return pizzas
  }
)
