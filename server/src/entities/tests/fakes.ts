import { random } from '@tests/utils/random'
import type { User, Brand, Country, Pizza } from '..'

const randomId = () => random.integer({ min: 1, max: 2147483647 })

export const fakeUser = <T extends Partial<User>>(overrides: T = {} as T) => ({
  id: randomId(),
  email: random.email(),
  password: `password-${random.string()}`,
  ...overrides,
})

export const fakePizza = <T extends Partial<Pizza>>(
  overrides: T = {} as T
) => ({
  id: randomId(),
  name: `pizza-${random.string()}`,
  ...overrides,
})

export const fakeBrand = <T extends Partial<Brand>>(
  overrides: T = {} as T
) => ({
  id: randomId(),
  title: `brand-${random.string()}`,
  ...overrides,
})

export const fakeCountry = <T extends Partial<Country>>(
  overrides: T = {} as T
) => ({
  id: randomId(),
  name: `country-${random.string()}`,
  ...overrides,
})
