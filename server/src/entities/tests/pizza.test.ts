import { createDatabase } from '@server/database'
import { Rating, Brand, Pizza, User, Country } from '..'
import { fakeBrand, fakeUser } from './fakes'

const db = createDatabase()
const pizzaRepository = db.getRepository(Pizza)
await db.initialize()

const mockUser = fakeUser()
const mockBrand = fakeBrand()

it('should save a pizza with all relations', async () => {
  const user = new User()
  user.email = mockUser.email
  user.password = mockUser.password

  const country = new Country()
  country.name = 'testcountry'

  const brand = new Brand()
  brand.title = mockBrand.title
  brand.country = country

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
  const savedPizza = await pizzaRepository.findOne({
    where: { id: pizza.id },
    relations: ['user', 'brand', 'ratings'],
  })

  expect(savedPizza).toBeDefined()

  expect(savedPizza?.user).toBeDefined()
  expect(savedPizza?.user).toMatchObject({
    email: mockUser.email,
  })

  expect(savedPizza?.brand).toBeDefined()
  expect(savedPizza?.brand).toMatchObject({
    title: mockBrand.title,
  })

  expect(savedPizza?.ratings).toHaveLength(2)
})
