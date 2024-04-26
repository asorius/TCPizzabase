import { Pizza } from '@server/entities/pizza'
import { userSchema } from '@server/entities/user'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'

export default authenticatedProcedure
  .input(userSchema.shape.id)
  .query(async ({ input: userId, ctx: { db } }) => {
    const hasUploadedImagesTo = await db.getRepository(Pizza).find({
      where: {
        images: {
          user: {
            id: userId,
          },
        },
      },
      relations: ['user', 'brand', 'brand.country', 'images', 'images.user'],
    })
    return [...hasUploadedImagesTo]
  })
