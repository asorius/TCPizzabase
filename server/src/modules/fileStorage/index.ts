import { router } from '@server/trpc'
import uploadImage from './upload'
import deleteImage from './delete'

export default router({
  uploadImage,
  deleteImage,
})
