import { createTestDatabase } from '@tests/utils/database'
import { Rating, Pizza } from '..'

const db = await createTestDatabase()
const pizzaRepository = db.getRepository(Pizza)
const ratingRepository = db.getRepository(Rating)

it('should add ratings for multiple pizzas', async () => {
  const pizza1 = new Pizza()
  pizza1.name = 'Test Pizza'
  const pizza2 = new Pizza()
  pizza2.name = 'Test Pizza2'

  const rating1 = new Rating()
  rating1.rating = 5
  rating1.pizza = pizza1

  const rating2 = new Rating()
  rating2.rating = 4
  rating2.pizza = pizza2
  const rating3 = new Rating()
  rating3.rating = 4
  rating3.pizza = pizza2

  pizza1.ratings = [rating1]
  pizza2.ratings = [rating2, rating3]

  await pizzaRepository.save(pizza1)
  await pizzaRepository.save(pizza2)

  const ratings = await ratingRepository.find({ relations: ['pizza'] })
  const ratingsForPizza2 = await ratingRepository.find({
    where: {
      pizza: {
        id: pizza2.id,
      },
    },
    relations: ['pizza'],
  })

  expect(ratings).toHaveLength(3)
  expect(ratingsForPizza2).toHaveLength(2)
})
