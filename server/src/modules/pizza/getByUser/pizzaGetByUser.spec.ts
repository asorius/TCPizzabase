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
const pizzaRoute = createCaller(authContext({ db }, user)).pizza

describe('Getting specific pizza data', () => {
  it('should return a pizza by id', async () => {
    // Add one pizza per user
    await db.getRepository(Pizza).save([fakePizza({ user: user2 }), mockPizza])

    const { getByUser } = pizzaRoute

    const pizza = await getByUser(mockPizza.id)

    expect(pizza.name).toEqual(mockPizza.name)
  })
  it('should throw an error for non existing pizza', async () => {
    const { getByUser } = pizzaRoute

    await expect(getByUser(22)).rejects.toThrow(/not found/)
  })
})
