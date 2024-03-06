import { createTestDatabase } from '@tests/utils/database'
import { User } from '..'
import { fakeUser } from './fakes'

const db = await createTestDatabase()
const userRepository = db.getRepository(User)

it('should save a user', async () => {
  const user = fakeUser()

  await userRepository.save({
    email: user.email,
    password: user.password,
  })
  const savedUser = (await userRepository.findOneOrFail({
    select: {
      id: true,
      email: true,
      password: true,
    },
    where: {
      email: user.email,
    },
  })) as Pick<User, 'id' | 'email' | 'password'>

  expect(savedUser).toEqual({
    id: expect.any(Number),
    email: user.email,
    password: user.password,
  })
})
