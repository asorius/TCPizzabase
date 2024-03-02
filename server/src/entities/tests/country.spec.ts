import { createDatabase } from '@server/database'
import { Country, Brand } from '..'
import { fakeBrand, fakeCountry } from './fakes'

const db = createDatabase()
const countryRepository = db.getRepository(Country)

await db.initialize()

it('should save a country', async () => {
  const country = fakeCountry()
  await countryRepository.save(country)
  const createdCountry = (await countryRepository.findOneOrFail({
    select: {
      id: true,
      name: true,
    },
    where: {
      name: country.name,
    },
  })) as Pick<Country, 'id' | 'name'>

  expect(createdCountry).toEqual({
    id: expect.any(Number),
    name: country.name,
  })
})
it.only('should save a country with brand relation', async () => {
  const mockBrand = fakeBrand()

  const mockCountry = fakeCountry()

  const country = new Country()
  country.name = mockCountry.name

  const brand = new Brand()
  brand.title = mockBrand.title

  country.brands = [brand]

  await countryRepository.save(country)

  const savedCountry = (await countryRepository.findOneOrFail({
    where: {
      name: mockCountry.name,
    },
    relations: ['brands'],
  })) as Pick<Country, 'brands'>

  console.log({
    countries: await countryRepository.find({
      relations: ['brands'],
    }),
  })

  expect(savedCountry.brands).toBeDefined()
  expect(savedCountry.brands).toHaveLength(1)
})