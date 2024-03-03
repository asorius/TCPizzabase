import { authContext } from '@tests/utils/context'
import { createTestDatabase } from '@tests/utils/database'
import { fakePizza, fakeUser } from '@server/entities/tests/fakes'
import { User } from '@server/entities'
import { router } from '..'
import { projectIdOwnerProcedure } from '.'

const routes = router({
  testCall: projectIdOwnerProcedure.query(() => 'passed'),
})

const db = await createTestDatabase()
const [
  {
    pizzas: [pizzaOne],
    ...userOne
  },
  {
    pizzas: [pizzaTwo],
  },
] = await db.getRepository(User).save([
  fakeUser({
    pizzas: [fakePizza()],
  }),
  fakeUser({
    pizzas: [fakePizza()],
  }),
])

const authenticated = routes.createCaller(authContext({ db }, userOne))

it.only('should pass if project belongs to the user', async () => {
  const response = await authenticated.testCall({ pizzaId: pizzaOne.id })

  expect(response).toEqual('passed')
})

it('should throw an error if pizzaId is not provided', async () => {
  // casting to any to allow calling without type safe input
  await expect((authenticated.testCall as any)({})).rejects.toThrow(/pizza/i)
})

it('should throw an error if user provides a non-existing pizzaId', async () => {
  // casting to any to allow calling without type safe input
  await expect(
    (authenticated.testCall as any)({ pizzaId: 999 })
  ).rejects.toThrow(/pizza/i)
})

it('should throw an error if user provides null pizzaId', async () => {
  await expect(
    authenticated.testCall({ pizzaId: null as any })
  ).rejects.toThrow(/pizza/i)
})

it('should throw an error if project does not belong to the user', async () => {
  await expect(
    authenticated.testCall({ pizzaId: pizzaTwo.id })
  ).rejects.toThrow(/pizza/i)
})
