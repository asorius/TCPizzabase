import { Pizza } from '@server/entities'
import { createTestDatabase } from '@tests/utils/database'
import { createCaller } from '@server/modules'
import { fakePizza } from '@server/entities/tests/fakes'

const db = await createTestDatabase()

const pizzaRoute = createCaller({ db }).pizza

await db.getRepository(Pizza).save(new Array(13).fill(fakePizza()))
const { get } = pizzaRoute

it('should return a list of 10 pizzas', async () => {
  const pizzas = await get({ brand: '', country: '', page: 0 })
  expect(pizzas).toHaveLength(10)
})
it('should return a list of 3 pizzas on the second pagingation run', async () => {
  const pizzas = await get({ brand: '', country: '', page: 1 })

  expect(pizzas).toHaveLength(3)
})
