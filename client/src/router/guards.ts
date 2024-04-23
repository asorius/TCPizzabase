import { isLoggedIn } from '@/stores/user'

export const authenticate = () => {
  if (!isLoggedIn.value) return { name: 'login' }

  return true
}
