// import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import { z } from 'zod'
import uploadImage from '@server/firebase/upload'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'

// Left procedure public to test implementation from front end without dabatase actions
// Otherwise, procedure will be authenticated
export default authenticatedProcedure
  .input(
    z.object({
      base64Image: z.string(),
      name: z.string(),
    })
  )
  .mutation(async ({ input }) => {
    try {
      const imageBuffer = Buffer.from(input.base64Image, 'base64')

      const res = await uploadImage({
        file: imageBuffer,
        name: input.name,
      })
      console.log({ upload: 'sucess' })
      return res
    } catch (error) {
      console.log({ errorupload: error })
      throw new Error('Upload failed')
    }
  })
