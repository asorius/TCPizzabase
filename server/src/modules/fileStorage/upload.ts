// import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import { z } from 'zod'
import uploadImage from '@server/firebase/upload'
import { publicProcedure } from '../../trpc'

// Left procedure public to test implementation from front end without dabatase actions
// Otherwise, procedure will be authenticated
export default publicProcedure
  .input(z.object({ base64Image: z.string(), name: z.string() }))
  .mutation(async ({ input }) => {
    try {
      const imageBuffer = Buffer.from(input.base64Image, 'base64')

      const res = await uploadImage({ file: imageBuffer, name: input.name })

      return res
    } catch (error) {
      console.log(error)
      throw new Error('Upload failed')
    }
  })
