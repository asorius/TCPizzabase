import { authContext } from '@tests/utils/context'
import { Brand, Country, Pizza, User } from '@server/entities'
import { fakeUser } from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { createCaller } from '@server/modules'

const db = await createTestDatabase()
const [user] = await db.getRepository(User).save([fakeUser()])

const pizzaRoute = createCaller(authContext({ db }, user)).pizza

it('Should return pizzas by country', async () => {
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

  const { filterByCountry } = pizzaRoute

  const pizzas = await filterByCountry({ name: 'country2' })

  expect(pizzas).toHaveLength(1)
  expect(pizzas[0].brand.country.name).toEqual('country2')
})
