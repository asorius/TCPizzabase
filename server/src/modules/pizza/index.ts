import { router } from '@server/trpc'
import create from './create'
import getByUser from './getByUser'
import get from './get'
import update from './update'
import deleteImage from './deleteImage'
import getById from './getById'

export default router({
  create,
  getByUser,
  update,
  deleteImage,
  getById,
  get,
})
