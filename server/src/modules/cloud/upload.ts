import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
// import { TRPCError } from '@trpc/server'

export default authenticatedProcedure.query(async ({ input }) => {
  console.log({ input })
  return 'lol'
})
