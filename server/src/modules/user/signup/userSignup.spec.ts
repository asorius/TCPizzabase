import { createTestDatabase } from '@tests/utils/database'
import { User } from '@server/entities'
import { fakeUser } from '@server/entities/tests/fakes'
import { createCaller } from '@server/modules'

const db = await createTestDatabase()
const userRepository = db.getRepository(User)
const userRoute = createCaller({ db }).user
const { signup } = userRoute

it('should save a user', async () => {
  const user = fakeUser()
  const response = await signup(user)

  const createdUser = (await userRepository.findOneOrFail({
    select: {
      id: true,
      email: true,
      password: true,
    },
    where: {
      email: user.email,
    },
  })) as Pick<User, 'id' | 'email' | 'password'>

  expect(createdUser).toEqual({
    id: expect.any(Number),
    email: user.email,
    password: expect.not.stringContaining(user.password),
  })

  expect(createdUser.password).toHaveLength(60)

  expect(response).toEqual({
    id: expect.any(Number),
    email: user.email,
  })

  expect(response.id).toEqual(createdUser!.id)
})

it('should require a valid email', async () => {
  await expect(
    signup({
      email: 'user-email-invalid',
      password: 'password.123',
    })
  ).rejects.toThrow(/email/i) // throws out some error complaining about "email"
})

it('should require a password with at least 8 characters', async () => {
  await expect(
    signup({
      email: 'user2@domain.com',
      password: 'pas.123',
    })
  ).rejects.toThrow(/password/i) // throws out some error complaining about "password"
})

it('throws an error for invalid email', async () => {
  await expect(
    signup({
      email: 'not-an-email',
      password: 'some-password',
    })
  ).rejects.toThrow(/email/)
})

it('stores lowercased email', async () => {
  const user = fakeUser()
  await signup({
    ...user,
    email: user.email.toUpperCase(),
  })

  await expect(
    userRepository.findOneByOrFail({
      email: user.email,
    })
  ).resolves.not.toBeNull()
})
