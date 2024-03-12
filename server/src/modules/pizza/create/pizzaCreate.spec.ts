import { authContext } from '@tests/utils/context'
import { fakeUser } from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { User } from '@server/entities'
import type { PizzaInsert } from '@server/entities/pizza'
import pizzaRouter from '..'

it('should create a pizza', async () => {
  const db = await createTestDatabase()
  const mockUser = fakeUser()
  const user = await db
    .getRepository(User)
    .save({ email: mockUser.email, password: mockUser.password })
  const { create } = pizzaRouter.createCaller(authContext({ db }, user))

  const userInput: PizzaInsert = {
    name: 'Test pizza',
    brand: 'new brand',
    country: 'new country',
    rating: 5,
    imageSource: 'url',
  }

  const createdPizza = await create(userInput)

  expect(createdPizza.name).toEqual(userInput.name)
  expect(createdPizza.user).toEqual(user)
  expect(createdPizza.brand.title).toEqual(userInput.brand)
})
