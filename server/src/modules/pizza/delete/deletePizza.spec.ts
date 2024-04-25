import { authContext } from '@tests/utils/context'
import { fakeUser } from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { User, Pizza, Country, Brand } from '@server/entities'
import { createCaller } from '@server/modules'

const db = await createTestDatabase()
const mockUser = fakeUser()

const user = await db
  .getRepository(User)
  .save({ email: mockUser.email, password: mockUser.password })

const pizzaRoute = createCaller(authContext({ db }, user)).pizza

// Populate database
const pizza1 = new Pizza()
pizza1.name = 'pizza1'

const country1 = new Country()
country1.name = 'country1'

const brand1 = new Brand()
brand1.title = 'brand1'

brand1.country = country1
pizza1.brand = brand1

const pizza2 = new Pizza()
pizza2.name = 'pizza2'

const country2 = new Country()
country2.name = 'country2'

const brand2 = new Brand()
brand2.title = 'brand2'

brand2.country = country2
pizza2.brand = brand2

await db.getRepository(Pizza).save([pizza1, pizza2])

const { deleteById } = pizzaRoute

it('Should delete pizza by id', async () => {
  const pizzasBefore = await db.getRepository(Pizza).find()
  await deleteById(pizza1.id)
  const pizzasAfter = await db.getRepository(Pizza).find()
  expect(pizzasBefore).toHaveLength(2)
  expect(pizzasAfter).toHaveLength(1)
  expect(pizzasAfter[0].name).toEqual(pizza2.name)
})
it('Should throw error when deleting pizza by incorrect id', async () => {
  await expect(deleteById(34)).rejects.toThrow(/not found/i)
})
