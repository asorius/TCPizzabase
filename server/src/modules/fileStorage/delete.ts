// import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import { z } from 'zod'
import deleteImage from '@server/firebase/delete'
import { publicProcedure } from '../../trpc'

// Left procedure public to test implementation from front end without dabatase actions
// Otherwise, procedure will be authenticated
export default publicProcedure
  .input(z.object({ path: z.string() }))
  .mutation(async ({ input }) => {
    try {
      const responseCode = await deleteImage({ path: input.path })

      return responseCode
    } catch (error) {
      throw new Error('Delete failed')
    }
  })
