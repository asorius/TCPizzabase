import { Pizza } from '@server/entities'
import { fakePizza } from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { createCaller } from '@server/modules'

const db = await createTestDatabase()

const pizzaRoute = createCaller({ db }).pizza

it('should return a list of all pizzas', async () => {
  // Add one pizza per user
  await db.getRepository(Pizza).save([fakePizza(), fakePizza()])

  const { getAll } = pizzaRoute

  const pizzas = await getAll()

  expect(pizzas).toHaveLength(2)
})
