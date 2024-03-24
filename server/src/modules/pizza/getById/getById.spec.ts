import { Pizza, Country, Brand } from '@server/entities'
import { createTestDatabase } from '@tests/utils/database'
import { createCaller } from '@server/modules'

const db = await createTestDatabase()

const pizzaRoute = createCaller({ db }).pizza

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

const { getById } = pizzaRoute

it('should return a pizza by id', async () => {
  const pizza = await getById(pizza2.id)

  expect(pizza?.name).toEqual(pizza2.name)
})

it('should throw an error for non existing pizza', async () => {
  await expect(getById(22)).rejects.toThrow(/not found/)
})
