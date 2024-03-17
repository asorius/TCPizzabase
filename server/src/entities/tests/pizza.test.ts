import { createTestDatabase } from '@tests/utils/database'
import { Image, Brand, Pizza, User } from '..'
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
  it('should assign images to a pizza', async () => {
    const pizza = new Pizza()
    pizza.name = 'Test Pizza'

    // Create related images
    const image = new Image()
    image.source = 'url'
    image.path = 'filepath'

    image.pizza = pizza
    image.rating = 5

    const image2 = new Image()
    image2.source = 'url'
    image2.pizza = pizza
    image2.path = 'filepath2'

    image2.rating = 4

    // Add images
    pizza.images = [image, image2]

    await pizzaRepository.save(pizza)

    const savedPizza = await pizzaRepository.findOne({
      where: { id: pizza.id },
      relations: ['images'],
    })
    const storedImages = await db.getRepository(Image).find()
    expect(savedPizza).toBeDefined()
    expect(savedPizza?.images).toHaveLength(2)
    expect(storedImages).toHaveLength(2)
  })
})
