import { authContext } from '@tests/utils/context'
import { Brand, Country, Pizza, User } from '@server/entities'
import { fakePizza, fakeUser } from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { createCaller } from '@server/modules'

const db = await createTestDatabase()
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

const pizzaRoute = createCaller(authContext({ db })).pizza

describe('Get all possible search options', () => {
  it('should return a list of countries and brands', async () => {
    const { searchOptions } = pizzaRoute

    const options = await searchOptions()
    console.log(options)
    expect(options.brands).toEqual(['brand1', 'brand2', 'brand3'])
    expect(options.countries).toEqual(['country1', 'country2'])
  })
})
