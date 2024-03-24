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

// New pizza3 within same `brand2` which belongs to `country2`
const pizza3 = new Pizza()
pizza3.name = 'pizza3'

pizza3.brand = brand2

await db.getRepository(Pizza).save([pizza1, pizza2, pizza3])

const { get } = pizzaRoute
it('Should return pizzas by brand and country', async () => {
  // Get all pizzas that are in `brand2` in `country2`
  const pizzas = await get({ brand: brand2.title, country: country2.name })

  expect(pizzas).toHaveLength(2)
  expect(pizzas[0].name).toEqual(pizza2.name)
  expect(pizzas[0].brand.title).toEqual(brand2.title)
  expect(pizzas[1].name).toEqual(pizza3.name)
  expect(pizzas[1].brand.title).toEqual(brand2.title)
})
