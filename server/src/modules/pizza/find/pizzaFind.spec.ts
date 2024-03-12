import { authContext } from '@tests/utils/context'
import { Pizza, User } from '@server/entities'
import { fakePizza, fakeUser } from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { createCaller } from '@server/modules'

it('should return a list of pizzas', async () => {
  const db = await createTestDatabase()
  const [user, user2] = await db
    .getRepository(User)
    .save([fakeUser(), fakeUser()])

  const mockPizza = fakePizza({ user })

  // Add one pizza per user
  await db.getRepository(Pizza).save([fakePizza({ user: user2 }), mockPizza])

  const pizzaRoute = createCaller(authContext({ db }, user)).pizza

  const { find } = pizzaRoute

  const userPizzas = await find()

  expect(userPizzas).toHaveLength(1)
  expect(userPizzas[0].name).toEqual(mockPizza.name)
})
