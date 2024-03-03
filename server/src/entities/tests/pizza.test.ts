import { createTestDatabase } from '@tests/utils/database'
import { Rating, Brand, Pizza, User } from '..'
import { fakeBrand, fakeUser } from './fakes'

const db = await createTestDatabase()
const pizzaRepository = db.getRepository(Pizza)

describe('Pizza relations', () => {
  it('should assign pizza to a user', async () => {
    const mockUser = fakeUser()
    const user = new User()

    user.email = mockUser.email
    user.password = mockUser.password

    const pizza = new Pizza()
    pizza.name = 'Test Pizza'
    pizza.user = user
    await pizzaRepository.save(pizza)

    const savedPizza = await pizzaRepository.findOne({
      where: { id: pizza.id },
      relations: ['user'],
    })

    expect(savedPizza).toBeDefined()

    expect(savedPizza?.user).toBeDefined()
    expect(savedPizza?.user).toMatchObject({
      email: mockUser.email,
    })
  })
  it('should assign brand to a pizza', async () => {
    const mockBrand = fakeBrand()
    const brand = new Brand()
    brand.title = mockBrand.title

    const pizza = new Pizza()
    pizza.name = 'Test Pizza'
    pizza.brand = brand

    await pizzaRepository.save(pizza)

    const savedPizza = await pizzaRepository.findOne({
      where: { id: pizza.id },
      relations: ['brand'],
    })

    expect(savedPizza).toBeDefined()

    expect(savedPizza?.brand).toBeDefined()
    expect(savedPizza?.brand).toMatchObject({
      title: mockBrand.title,
    })
  })
  it('should assign ratings to a pizza', async () => {
    const pizza = new Pizza()
    pizza.name = 'Test Pizza'

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

    const savedPizza = await pizzaRepository.findOne({
      where: { id: pizza.id },
      relations: ['ratings'],
    })
    expect(savedPizza).toBeDefined()
    expect(savedPizza?.ratings).toHaveLength(2)
  })
})
