import { router } from '@server/trpc'
import create from './create'
import getByUser from './getByUser'
import get from './get'
import update from './update'
import deleteImage from './deleteImage'
import getById from './getById'
import searchOptions from './searchOptions'
import deleteById from './delete'

export default router({
  create,
  getByUser,
  update,
  deleteImage,
  getById,
  get,
  searchOptions,
  deleteById,
})
