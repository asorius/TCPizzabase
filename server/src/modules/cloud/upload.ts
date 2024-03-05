import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import { z } from 'zod'
import uploadImage from '@server/firebase/upload'
import { publicProcedure } from '../../trpc'
// import { TRPCError } from '@trpc/server'
export default publicProcedure
  .input(z.object({ img: z.any(), name: z.string() }))
  .mutation(async ({ input }) => {
    const buff = Buffer.from(input.img, 'base64')
    const imageBlobl = new Blob([buff])
    console.log({
      input,
      buff,
      imageBlobl,
    })
    const res = await uploadImage({ file: buff, name: input.name })
    return 'lol'
  })
