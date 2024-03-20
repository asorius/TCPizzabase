import { router } from '@server/trpc'
import create from './create'
import getByUser from './getByUser'
import getAll from './getAll'
import update from './update'
import deleteImage from './deleteImage'
import filterByBrand from './filterByBrand'
import filterByCountry from './filterByCountry'

export default router({
  create,
  getByUser,
  getAll,
  update,
  deleteImage,
  filterByBrand,
  filterByCountry,
})
