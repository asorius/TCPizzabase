import { authContext } from '@tests/utils/context'
import { Pizza, User } from '@server/entities'
import { fakePizza, fakeUser } from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { createCaller } from '@server/modules'

const db = await createTestDatabase()
const user = await db.getRepository(User).save(fakeUser())
const user2 = await db.getRepository(User).save(fakeUser())

const mockPizza = fakePizza({ user })
const pizzaRoute = createCaller(authContext({ db }, user)).pizza

describe('Updating existing pizza', () => {
  it('should add images', async () => {
    // Add a pizza
    await db.getRepository(Pizza).save(mockPizza)

    const storedPizza = await db.getRepository(Pizza).findOne({
      where: { id: mockPizza.id },
      relations: ['images', 'user', 'images.user'],
    })

    if (storedPizza) {
      const oneImageInsertion = await pizzaRoute.update({
        pizzaId: storedPizza.id,
        imageUrl: 'newUrl',
        imagePath: 'images/newUrl',
        userId: user.id,
        rating: 3,
      })
      const twoImageInsertion = await pizzaRoute.update({
        pizzaId: storedPizza.id,
        imageUrl: 'newUrl2',
        imagePath: 'images/newUrl2',
        rating: 5,
        userId: user2.id,
      })
      // Confirm old stored value
      expect(storedPizza.images).toHaveLength(0)
      // Check new updated value
      expect(oneImageInsertion.images).toHaveLength(1)
      expect(oneImageInsertion.images[0].source).toEqual('newUrl')

      expect(twoImageInsertion.images).toHaveLength(2)
      expect(twoImageInsertion.images[1].source).toEqual('newUrl2')
    }
  })
})
