import { Pizza } from '@server/entities'
import { createTestDatabase } from '@tests/utils/database'
import { createCaller } from '@server/modules'
import { fakePizza } from '@server/entities/tests/fakes'

const db = await createTestDatabase()

const pizzaRoute = createCaller({ db }).pizza

await db.getRepository(Pizza).save([fakePizza(), fakePizza()])

const { get } = pizzaRoute

it('should return a list of all pizzas with no filtering', async () => {
  const pizzas = await get({ brand: '', country: '' })

  expect(pizzas).toHaveLength(2)
})
