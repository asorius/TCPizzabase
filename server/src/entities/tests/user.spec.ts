import { createDatabase } from '@server/database'
import { User } from '..'
import { fakeUser } from './fakes'

const db = await createDatabase()
const userRepository = db.getRepository(User)

it.only('should save a user', async () => {
  const user = fakeUser()
  await userRepository.save(user)
  const userCreated = (await userRepository.findOneOrFail({
    select: {
      id: true,
      email: true,
      profile: true,
    },
    where: {
      email: user.email,
    },
  })) as Pick<User, 'id' | 'email' | 'profile'>

  expect(userCreated).toEqual({
    id: expect.any(Number),
    email: user.email,
    profile: expect.not.stringContaining(user.profile),
  })
})
