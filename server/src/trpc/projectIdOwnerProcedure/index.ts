import { TRPCError } from '@trpc/server'
import z from 'zod'
import { Pizza } from '@server/entities'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import provideRepos from '../provideRepos'

export const pizzaIdOwnerProcedure = authenticatedProcedure
  .use(provideRepos({ Pizza }))
  .input(
    z.object({
      pizzaId: z.number(),
    })
  )
  .use(async ({ input: { pizzaId }, ctx: { authUser, repos }, next }) => {
    const pizza = await repos.Pizza.findOne({
      select: {
        user: { id: true },
      },
      where: {
        id: pizzaId,
      },
      relations: ['user'],
    })

    if (!pizza) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Project not found',
      })
    }

    if (pizza.user.id !== authUser.id) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Project does not belong to the user',
      })
    }

    return next()
  })
