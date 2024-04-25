// import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import { z } from 'zod'
import deleteImage from '@server/firebase/delete'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'

// Left procedure public to test implementation from front end without dabatase actions
// Otherwise, procedure will be authenticated
export default authenticatedProcedure
  .input(z.object({ path: z.string() }))
  .mutation(async ({ input }) => {
    try {
      const responseCode = await deleteImage({ path: input.path })

      return responseCode
    } catch (error) {
      throw new Error('Delete failed')
    }
  })
