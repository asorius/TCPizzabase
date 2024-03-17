import { authContext } from '@tests/utils/context'
import { Pizza, User } from '@server/entities'
import { fakePizza, fakeUser } from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { createCaller } from '@server/modules'

const db = await createTestDatabase()
const user = await db.getRepository(User).save(fakeUser())

const mockPizza = fakePizza({ user })
const pizzaRoute = createCaller(authContext({ db }, user)).pizza

it('should remove an image from image list', async () => {
  // Add a pizza
  await db.getRepository(Pizza).save(mockPizza)
  // Retrieve pizza record with relations
  const storedPizza = await db
    .getRepository(Pizza)
    .findOne({ where: { id: mockPizza.id }, relations: ['images', 'user'] })

  if (storedPizza) {
    // Update pizza by adding two images
    await pizzaRoute.update({
      pizzaId: storedPizza.id,
      imageUrl: 'url1',
      imagePath: 'images/url1',
    })

    await pizzaRoute.update({
      pizzaId: storedPizza.id,
      imageUrl: 'url2',
      imagePath: 'images/url2',
    })

    const pizzaWithImages = await db
      .getRepository(Pizza)
      .findOne({ where: { id: mockPizza.id }, relations: ['images', 'user'] })

    const result = await pizzaRoute.deleteImage({
      pizzaId: storedPizza.id,
      imageUrl: 'url1',
    })
    // Confirm old stored value
    expect(pizzaWithImages?.images).toHaveLength(2)

    // Check new updated value
    expect(result.images).toHaveLength(1)
    expect(result.images[0].source).toEqual('url2')
    expect(result.images[0].path).toEqual('images/url2')
  }
})
