import { createTestDatabase } from '@tests/utils/database'
import { Image, Pizza } from '..'

const db = await createTestDatabase()
const pizzaRepository = db.getRepository(Pizza)
const imageRepository = db.getRepository(Image)

it('should add images for multiple pizzas', async () => {
  const pizza1 = new Pizza()
  pizza1.name = 'Test Pizza'
  const pizza2 = new Pizza()
  pizza2.name = 'Test Pizza2'

  const image1 = new Image()
  image1.source = 'url'
  image1.pizza = pizza1
  image1.rating = 3

  const image2 = new Image()
  image2.source = 'url2'
  image2.pizza = pizza2
  image2.rating = 4

  const image3 = new Image()
  image3.source = 'url22'
  image3.pizza = pizza2
  image3.rating = 7

  pizza1.images = [image1]
  pizza2.images = [image2, image3]

  await pizzaRepository.save(pizza1)
  await pizzaRepository.save(pizza2)

  const images = await imageRepository.find({ relations: ['pizza'] })
  const imagesForPizza2 = await imageRepository.find({
    where: {
      pizza: {
        id: pizza2.id,
      },
    },
    relations: ['pizza'],
  })

  expect(images).toHaveLength(3)
  expect(imagesForPizza2).toHaveLength(2)
})
