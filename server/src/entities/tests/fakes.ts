import { random } from '@tests/utils/random'
import type { User, Brand, Country, Pizza } from '..'

const randomId = () => random.integer({ min: 1, max: 2147483647 })

/**
 * Generates a fake user with some default test data.
 * @param overrides Any properties that should be different from default fake data.
 */
export const fakeUser = <T extends Partial<User>>(overrides: T = {} as T) => ({
  id: randomId(),
  email: random.email(),
  profile: 'google.com/123!',
  ...overrides,
})

/**
 * Generates a fake project with some default test data.
 * @param overrides Any properties that should be different from default fake data.
 */
export const fakePizza = <T extends Partial<Pizza>>(
  overrides: T = {} as T
) => ({
  id: randomId(),
  name: random.string(),
  ...overrides,
})

/**
 * Generates a fake bug with some default test data.
 * @param overrides Any properties that should be different from default fake data.
 */
export const fakeBrand = <T extends Partial<Brand>>(
  overrides: T = {} as T
) => ({
  id: randomId(),
  title: 'FakeBrandTitle',
  ...overrides,
})

/**
 * Generates a fake bug with some default test data.
 * @param overrides Any properties that should be different from default fake data.
 */
export const fakeCountry = <T extends Partial<Country>>(
  overrides: T = {} as T
) => ({
  id: randomId(),
  name: 'FakeCountryName',
  ...overrides,
})
