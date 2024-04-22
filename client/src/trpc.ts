import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
// @ts-ignore - importing through direct path propagates types faster
import type { AppRouter } from '@server/shared/trpc'

import { apiBase } from '@/config'
import SuperJSON from 'superjson'
import { getStoredAccessToken } from './utils/auth'

export const trpc = createTRPCProxyClient<AppRouter>({
  // auto convert Date <-> string
  transformer: SuperJSON,
  links: [
    httpBatchLink({
      url: apiBase,

      // send the access token with every request
      headers: () => {
        const token = getStoredAccessToken(localStorage)
        return {
          Authorization: `Bearer ${token}`
        }
      }
    })
  ]
})
