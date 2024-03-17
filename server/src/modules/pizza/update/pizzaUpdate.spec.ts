import { authContext } from '@tests/utils/context'
import { Pizza, User } from '@server/entities'
import { fakePizza, fakeUser } from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { createCaller } from '@server/modules'

const db = await createTestDatabase()
const user = await db.getRepository(User).save(fakeUser())

const mockPizza = fakePizza({ user })
const pizzaRoute = createCaller(authContext({ db }, user)).pizza

describe('Updating existing pizza', () => {
  it('should add an image', async () => {
    // Add a pizza
    await db.getRepository(Pizza).save(mockPizza)

    const storedPizza = await db
      .getRepository(Pizza)
      .findOne({ where: { id: mockPizza.id }, relations: ['images', 'user'] })

    if (storedPizza) {
      const result = await pizzaRoute.update({
        pizzaId: storedPizza.id,
        imageUrl: 'newUrl',
      })
      // Confirm old stored value
      expect(storedPizza.images).toHaveLength(0)

      // Check new updated value
      expect(result.images).toHaveLength(1)
      expect(result.images[0].source).toEqual('newUrl')
    }
  })
})
