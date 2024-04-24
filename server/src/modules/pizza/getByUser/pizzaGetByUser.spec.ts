import { authContext } from '@tests/utils/context'
import { Pizza, User } from '@server/entities'
import { fakePizza, fakeUser } from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { createCaller } from '@server/modules'

const db = await createTestDatabase()
const [user, user2] = await db
  .getRepository(User)
  .save([fakeUser(), fakeUser()])

const mockPizza = fakePizza({ user })
const mockPizza2 = fakePizza({ user })
const pizzaRoute = createCaller(authContext({ db }, user)).pizza

describe('Getting specific pizza data', () => {
  it('should return a pizza by id', async () => {
    await db
      .getRepository(Pizza)
      .save([fakePizza({ user: user2 }), mockPizza, mockPizza2])

    const { getByUser } = pizzaRoute
    const pizzas = await getByUser(mockPizza.user.id)

    expect(pizzas).toHaveLength(2)
    expect(pizzas[0].name).toEqual(mockPizza.name)
  })
})
