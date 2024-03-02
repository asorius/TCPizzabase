// import { createDatabase } from '@server/database'
import { createTestDatabase } from '@tests/utils/database'
import { Country, Brand } from '..'
import { fakeBrand, fakeCountry } from './fakes'

const db = await createTestDatabase()
const countryRepository = db.getRepository(Country)
const brandRepository = db.getRepository(Brand)

it('should save a brand', async () => {
  const brand = fakeBrand()
  await brandRepository.save({ title: brand.title })
  const createdBrand = (await brandRepository.findOneOrFail({
    select: {
      id: true,
      title: true,
    },
    where: {
      title: brand.title,
    },
  })) as Pick<Brand, 'id' | 'title'>

  expect(createdBrand).toEqual({
    id: expect.any(Number),
    title: brand.title,
  })
})

it('should save a brand with country relation', async () => {
  const brand = fakeBrand()

  const country = fakeCountry()

  await countryRepository.save({ name: country.name })

  const createdCountry = (await countryRepository.findOneOrFail({
    where: {
      name: country.name,
    },
  })) as Pick<Country, 'id' | 'name'>

  await brandRepository.save({
    title: brand.title,
    country: createdCountry,
  })
  const createdBrand = (await brandRepository.findOneOrFail({
    select: {
      id: true,
      title: true,
      country: { id: true, name: true },
    },
    where: {
      title: brand.title,
    },
    relations: ['country'],
  })) as Pick<Brand, 'id' | 'title' | 'country'>

  expect(createdBrand).toEqual({
    id: expect.any(Number),
    title: brand.title,
    country: createdCountry,
  })
})
