import { router, createCallerFactory } from '../trpc'
import pizza from './pizza'
import user from './user'
import fileStorage from './fileStorage'

export const appRouter = router({
  pizza,
  user,
  fileStorage,
})

export type AppRouter = typeof appRouter
export const createCaller = createCallerFactory(appRouter)
