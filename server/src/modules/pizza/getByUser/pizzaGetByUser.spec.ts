import { authContext } from '@tests/utils/context'
import { Image, Pizza, User } from '@server/entities'
import { fakePizza, fakeUser } from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { createCaller } from '@server/modules'

const db = await createTestDatabase()
const [user, user2] = await db
  .getRepository(User)
  .save([fakeUser(), fakeUser()])

const image = new Image()
image.user = user
image.rating = 3
image.source = '44ds'
image.path = '3333gg'

const mockPizza = fakePizza({ user })
const mockPizza2 = fakePizza({ user })
const mockPizza3 = fakePizza({
  user: user2,
  images: [image],
})
const pizzaRoute = createCaller(authContext({ db }, user)).pizza

describe('Getting pizzas by user', () => {
  it('should include pizzas where user has uploaded their photos', async () => {
    // for some reason this adds new pizzas upon repo saved from previous test
    await db.getRepository(Pizza).save([mockPizza, mockPizza2, mockPizza3])

    const { getByUser } = pizzaRoute
    const pizzas = await getByUser(user.id)

    expect(pizzas).toHaveLength(1)
    expect(pizzas[0].name).toEqual(mockPizza3.name)
  })
})
