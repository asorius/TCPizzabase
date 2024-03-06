import { createTestDatabase } from '@tests/utils/database'
import { Country, Brand } from '..'
import { fakeBrand, fakeCountry } from './fakes'

const db = await createTestDatabase()
const countryRepository = db.getRepository(Country)
const brandRepository = db.getRepository(Brand)

describe('Brand relations', () => {
  it('should save a brand', async () => {
    const mockBrand = fakeBrand()

    await brandRepository.save({ title: mockBrand.title })

    const createdBrand = (await brandRepository.findOneOrFail({
      select: {
        id: true,
        title: true,
      },
      where: {
        title: mockBrand.title,
      },
    })) as Pick<Brand, 'id' | 'title'>

    expect(createdBrand).toEqual({
      id: expect.any(Number),
      title: mockBrand.title,
    })
  })

  it('should save a brand with country relation', async () => {
    const mockBrand = fakeBrand()

    const mockCountry = fakeCountry()

    await countryRepository.save({ name: mockCountry.name })

    const createdCountry = (await countryRepository.findOneOrFail({
      where: {
        name: mockCountry.name,
      },
    })) as Pick<Country, 'id' | 'name'>

    await brandRepository.save({
      title: mockBrand.title,
      country: createdCountry,
    })

    const createdBrand = (await brandRepository.findOneOrFail({
      select: {
        id: true,
        title: true,
        country: { id: true, name: true },
      },
      where: {
        title: mockBrand.title,
      },
      relations: ['country'],
    })) as Pick<Brand, 'id' | 'title' | 'country'>

    expect(createdBrand).toEqual({
      id: expect.any(Number),
      title: mockBrand.title,
      country: createdCountry,
    })
  })
})
