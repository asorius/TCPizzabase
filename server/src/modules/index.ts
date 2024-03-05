import { router } from '../trpc'
// import bug from './bug'
import pizza from './pizza'
import user from './user'

export const appRouter = router({
  // bug,
  pizza,
  user,
})

export type AppRouter = typeof appRouter
