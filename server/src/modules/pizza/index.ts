import { router } from '@server/trpc'
import create from './create'
import getByUser from './getByUser'
import getAll from './getAll'
import update from './update'

export default router({
  create,
  getByUser,
  getAll,
  update,
})
