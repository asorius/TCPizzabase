import { createDatabase } from '@server/database'
import { Rating, Brand, Pizza, User } from '..'
import { fakeBrand, fakeUser } from './fakes'

const db = createDatabase()
const brandRepository = db.getRepository(Brand)
const pizzaRepository = db.getRepository(Pizza)
const userRepository = db.getRepository(User)
// const ratingRepository = db.getRepository(Rating)
await db.initialize()

const mockUser = fakeUser()
const mockBrand = fakeBrand()

it('should save a pizza with all relations', async () => {
  // Create and save a user and brand
  const user = new User()
  user.email = mockUser.email
  user.profile = mockUser.profile
  await userRepository.save(user)

  const brand = new Brand()
  brand.title = mockBrand.title

  // Create  a pizza
  const pizza = new Pizza()
  pizza.name = 'Test Pizza'
  pizza.user = user
  pizza.brand = brand

  // Create related ratings
  const rating1 = new Rating()
  rating1.rating = 5
  rating1.pizza = pizza

  const rating2 = new Rating()
  rating2.rating = 4
  rating2.pizza = pizza

  // Add ratings
  pizza.ratings = [rating1, rating2]

  await pizzaRepository.save(pizza)

  // Retrieve the pizza from the database to check relations
  const retrievedPizza = await pizzaRepository.findOne({
    where: { id: pizza.id },
    relations: ['user', 'brand', 'ratings'],
  })
  console.log({
    retrievedPizza,
    newbrands: await brandRepository.find({ relations: ['pizzas', 'country'] }),
  })
  expect(retrievedPizza).toBeDefined()

  expect(retrievedPizza?.user).toBeDefined()
  expect(retrievedPizza?.user).toMatchObject({
    email: mockUser.email,
  })

  expect(retrievedPizza?.brand).toBeDefined()
  expect(retrievedPizza?.brand).toMatchObject({
    title: mockBrand.title,
  })

  expect(retrievedPizza?.ratings).toHaveLength(2)
})
