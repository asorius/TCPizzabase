import { router } from '../trpc'
import pizza from './pizza'
import user from './user'
import cloud from './cloud'

export const appRouter = router({
  pizza,
  user,
  cloud,
})

export type AppRouter = typeof appRouter
